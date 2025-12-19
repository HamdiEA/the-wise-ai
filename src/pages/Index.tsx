import Header from "@/components/Header";
import HeroSectionWithVideo from "@/components/HeroSectionWithVideo";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Bot, Facebook, Instagram, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSmoothSwipe } from "@/hooks/use-smooth-swipe";

const Index = () => {
  const { getSwipeStyle } = useSmoothSwipe({
    nextPage: "/menu",
  });

  return (
    <GlobalBackground>
      <div className="flex flex-col flex-1" style={getSwipeStyle()}>
        <Header />
        <div className="flex-1">
          <HeroSectionWithVideo />

          {/* Infos pratiques & chatbot */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 bg-black/40 backdrop-blur-lg border border-amber-400/30 rounded-3xl shadow-2xl p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" className="border-amber-400/60 text-white bg-black/40 hover:bg-amber-600/30">
                  <Link to="/menu">
                    Voir le menu
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Horaires & Coordonnées</h2>
              <p className="text-gray-200 leading-relaxed">
                Visitez-nous dans nos 3 emplacements. Commandez ou réservez par téléphone.
              </p>
              <div className="space-y-4">
                {[
                  { city: "Bardo Tunis", phone: "52 555 414", address: "AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS" },
                  { city: "Teboulba", phone: "93 560 560", address: "RUE HABIB BOURGUIBA - TEBOULBA" },
                  { city: "Ksar Hellal Monastir", phone: "52 555 400", address: "AV HAJ ALI SOUA KSAR HELLAL - MONASTIR" },
                ].map((loc, idx) => (
                  <div key={idx} className="rounded-2xl border border-amber-400/30 bg-black/30 p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-amber-200 font-semibold">
                      <MapPin className="h-4 w-4" />
                      {loc.city}
                    </div>
                    <div className="flex items-center gap-2 text-gray-100">
                      <Clock className="h-4 w-4 text-amber-300" />
                      <span>Lun-Dim : 12h00 - 00h00</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-100">
                      <Phone className="h-4 w-4 text-amber-300" />
                      <span>{loc.phone}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {loc.address}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-gray-200">Suivez-nous :</span>
                <a href="https://www.facebook.com/profile.php?id=100083865516162" target="_blank" rel="noreferrer" className="rounded-full p-2 bg-amber-500/20 border border-amber-400/40 text-white hover:bg-amber-500/40 transition" title="The Wise Bardo - Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/the.wise_teboulba/" target="_blank" rel="noreferrer" className="rounded-full p-2 bg-amber-500/20 border border-amber-400/40 text-white hover:bg-amber-500/40 transition" title="The Wise Teboulba - Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6 text-amber-300" />
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">Assistant The Wise</h2>
              </div>
              <p className="text-gray-200 leading-relaxed">
                Discutez avec notre chatbot intégré pour :
              </p>
              <ul className="space-y-3 text-gray-100">
                <li>• Recommander des plats selon vos envies.</li>
                <li>• Vérifier rapidement les ingrédients ou les suppléments.</li>
                <li>• Préparer votre commande avant de passer en caisse.</li>
                <li>• Découvrir nos offres et suggestions du chef.</li>
              </ul>
              <div className="rounded-2xl border border-amber-400/30 bg-black/30 p-6 shadow-inner">
                <p className="text-amber-200 font-semibold mb-2">Astuce</p>
                <p className="text-gray-200 leading-relaxed">
                  Ouvrez le bouton d'assistant flottant en bas à droite pour démarrer la conversation à tout moment.
                </p>
              </div>
            </div>
          </div>
        </section>
        </div>

        <Footer />
      </div>
    </GlobalBackground>
  );
};

export default Index;
