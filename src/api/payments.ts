
// src/api/payments.ts
import { supabase } from "../lib/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface PaymentData {
  productId: string;
  amount: number; // Em Reais (será convertido para centavos)
  currency: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: "card" | "pix" | "boleto";
  taxId?: string; // CPF/CNPJ para Boleto
}

export interface NextAction {
  type: string;
  display_pix_qr_code?: {
    data: string;
    image_url_png: string;
    expires_at: number;
  };
  redirectToUrl?: string; // Para Boleto ou redirecionamentos
}

export interface PaymentResponse {
  clientSecret?: string;
  id?: string;
  status: string;
  nextAction?: NextAction;
  error?: string;
}
export interface PaymentError {
  message: string;
  code?: string;
}
export const paymentsApi = {
  /**
   * Cria uma intenção de pagamento no Stripe via Backend Go
   */
  async processPayment(data: PaymentData): Promise<PaymentResponse> {
    console.log("Iniciando processamento via API Backend:", data);

    const body = {
      amount: Math.round(data.amount * 100), // Converte para centavos
      currency: data.currency.toLowerCase(),
      payment_method: data.paymentMethod,
      email: data.customerEmail,
      name: data.customerName,
      tax_id: data.taxId
    };

    try {
      const response = await fetch(`${API_URL}/api/v1/payments/create-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao processar pagamento");
      }

      // Registrar transação estruturada na nova tabela 'payments' do Supabase
      if (supabase) {
        await supabase.from("payments").insert({
          stripe_id: result.id,
          product_id: parseInt(data.productId),
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          tax_id: data.taxId,
          amount: Math.round(data.amount * 100),
          currency: data.currency.toLowerCase(),
          payment_method: data.paymentMethod,
          status: result.status,
          client_secret: result.clientSecret,
          metadata: result.nextAction || {}
        });
        
        // Mantemos também a interação para estatísticas genéricas
        await supabase.from("interactions").insert({
          type: "purchase_intent_created",
          product_id: data.productId,
          metadata: { 
            status: result.status, 
            method: data.paymentMethod,
            amount: data.amount,
            customer: data.customerEmail
          }
        });
      }

      return result as PaymentResponse;
    } catch (error: PaymentError | unknown) {
      console.error("Erro na API de Pagamentos:", error);
      throw error;
    }
  }
};
