import { Link } from "react-router-dom";
import { IconArrowLeft } from "../components/Icons";

export default function PrivacyPage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <main className="flex-grow pt-[140px] pb-24 px-8 md:px-16 max-w-[900px] mx-auto w-full">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition-colors duration-200 mb-12"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">
            <IconArrowLeft />
          </span>
          Voltar para a home
        </Link>

        <h1 className="[font-family:'Playfair_Display',serif] text-[40px] md:text-[56px] font-bold leading-tight mb-8">
          Política de <em className="not-italic">Privacidade</em>
        </h1>

        <div className="font-sans text-white/70 space-y-6 leading-relaxed text-base">
          <section>
            <h2 className="text-white text-xl font-bold mb-4">1. Coleta de Informações</h2>
            <p>
              Coletamos as informações necessárias para processar seu pedido, como seu nome e endereço de e-mail, ao realizar uma compra. Também coletamos o seu e-mail quando você se inscreve na nossa newsletter.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">2. Uso das Informações</h2>
            <p>
              Suas informações são utilizadas exclusivamente para entregar seus ebooks adquiridos, fornecer suporte ao cliente e enviar comunicações de marketing, se você tiver dado o seu consentimento.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">3. Proteção de Dados</h2>
            <p>
              Empregamos medidas de segurança técnicas e administrativas para proteger seus dados pessoais contra acesso não autorizado, uso indevido ou divulgação. Não compartilhamos suas informações com terceiros, exceto quando necessário para processar pagamentos.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">4. Seus Direitos</h2>
            <p>
              Você tem o direito de solicitar o acesso aos seus dados pessoais, solicitar correções ou a exclusão dos mesmos a qualquer momento, entrando em contato através do nosso e-mail de suporte.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">5. Cookies</h2>
            <p>
              Utilizamos cookies para melhorar sua experiência de navegação em nosso site e para entender como ele está sendo utilizado, permitindo-nos otimizar nossos serviços.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
