import { Link } from "react-router-dom";
import { IconArrowLeft } from "../components/Icons";

export default function TermsPage() {
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
          Termos de <em className="not-italic">Uso</em>
        </h1>

        <div className="font-sans text-white/70 space-y-6 leading-relaxed text-base">
          <section>
            <h2 className="text-white text-xl font-bold mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o site da Focus Conhecimento, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deve utilizar nosso site ou adquirir nossos produtos.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">2. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo disponibilizado em nossos ebooks, incluindo textos, gráficos, logotipos, imagens e software, é de propriedade exclusiva da Focus Conhecimento ou de seus fornecedores de conteúdo e está protegido pelas leis de direitos autorais.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">3. Licença de Uso</h2>
            <p>
              Ao adquirir um ebook, concedemos a você uma licença pessoal, não exclusiva e intransferível para ler o conteúdo. Você não tem permissão para reproduzir, distribuir, vender, alugar ou criar obras derivadas de nossos materiais sem autorização prévia por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">4. Limitação de Responsabilidade</h2>
            <p>
              A Focus Conhecimento não se responsabiliza por quaisquer danos diretos, indiretos ou incidentais resultantes do uso das informações contidas em nossos ebooks. O conteúdo é fornecido para fins educacionais e informativos.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">5. Alterações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações entrarão em vigor imediatamente após sua publicação no site.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
