
// src/api/payments.ts
import { supabase } from "../lib/supabaseClient";

const API_URL =  "http://localhost:8080";

export interface PaymentData {
  productId: string;
  amount: number; // Em Reais (será convertido para centavos)
  currency: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: "card" | "pix" | "boleto";
  taxId?: string; // CPF/CNPJ para Boleto
  line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
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
    // 1. Sanitização rigorosa dos dados
    const amountInCents = Math.round(data.amount * 100);
    const customerEmail = data.customerEmail.replace(/\s+/g, ""); // Remove TODOS os espaços, inclusive internos

    console.log("DEBUG - Dados recebidos no processPayment:", { ...data });
    
    // Payload estrito para o Backend Go
    const body = {
      amount: amountInCents,
      currency: data.currency.toLowerCase(),
      email: customerEmail
    };

    console.log("DEBUG - Payload final enviado para /api/v1/payments/create-intent:", body);

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

      // 2. Registro no Supabase com os dados sanitizados
      if (supabase) {
        await supabase.from("payments").insert({
          stripe_id: result.id,
          product_id: parseInt(data.productId),
          customer_name: data.customerName,
          customer_email: customerEmail,
          tax_id: data.taxId,
          amount: amountInCents,
          currency: data.currency.toLowerCase(),
          payment_method: data.paymentMethod,
          status: result.status,
          client_secret: result.clientSecret,
          metadata: result.nextAction || {}
        });
        
        await supabase.from("interactions").insert({
          type: "purchase_intent_created",
          target_id: data.productId,
          metadata: { 
            status: result.status, 
            method: data.paymentMethod,
            amount: amountInCents,
            customer: customerEmail
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
