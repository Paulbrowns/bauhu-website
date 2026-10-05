(() => {
  const root = document.querySelector('.home-detail[data-model-slug]');
  if (!root) return;

  const copyBySlug = {
  "sky": {
    "title": "Minimalist open-plan living in a compact Element home.",
    "paragraphs": [
      "Element SKY is a compact contemporary home shaped around minimalist design, clean lines and open-plan living.",
      "The layout brings living, dining and kitchen spaces together to maximise usable area and create a light, efficient interior.",
      "As part of the Element range, it is framed by Bauhu’s climate-resilient steel construction system with durable, highly insulated components for long-term performance."
    ]
  },
  "arc": {
    "title": "A compact three-bedroom Element home for family living or rental use.",
    "paragraphs": [
      "Element ARC is a compact three-bedroom, two-bathroom modular home suited to family living, holiday retreats or vacation rental use.",
      "The design combines sleek modern aesthetics with a practical layout, bedrooms with useful storage and natural light, and bathrooms finished with a high-end contemporary character.",
      "Like the wider Element range, ARC is positioned as a sustainable, climate-resilient home designed for durability, efficient delivery and long-term value."
    ]
  },
  "ice": {
    "title": "Two-bedroom Element living with open-plan space and covered terraces.",
    "paragraphs": [
      "Element ICE is a stylish two-bedroom, two-bathroom contemporary modular home focused on functionality, sophistication and practical everyday living.",
      "The open-plan layout maximises space and natural light, linking the principal interior spaces with the covered terrace for easy indoor-outdoor living.",
      "Both bedrooms are designed for comfort and storage, while the bathrooms bring a more refined, contemporary level of finish to a compact footprint."
    ]
  },
  "eon": {
    "title": "A three-bedroom Element home with a contemporary island-style roof.",
    "paragraphs": [
      "Element EON is a three-bedroom, two-bathroom home that blends the clean aesthetics of the Element range with a contemporary interpretation of an island-style roof.",
      "The roof overhang extends across the terrace, creating shade, natural cooling and a more comfortable outdoor living area.",
      "Designed for permanent residence, second-home use or vacation rental, EON balances architectural character with practical, climate-resilient construction."
    ]
  },
  "zen": {
    "title": "Modern two-bedroom living with direct connections to the terrace.",
    "paragraphs": [
      "Element ZEN is a modern two-bedroom, two-bathroom modular home designed around functionality, sophistication and a simple contemporary footprint.",
      "The open-plan layout draws natural light through the home and creates a direct relationship between the living spaces, bedrooms and exterior deck areas.",
      "Both bedroom suites connect to outdoor space, while the bathrooms and finishes reinforce the refined, practical character of the Element range."
    ]
  },
  "air": {
    "title": "A hillside-ready Element home with a compact contemporary footprint.",
    "paragraphs": [
      "Element AIR is a two-bedroom, two-bathroom modular home designed to work efficiently on steep or sloping sites.",
      "The footprint is arranged to reduce groundwork and foundation requirements while retaining open-plan living, contemporary kitchens and practical bathrooms.",
      "With its hillside focus, AIR combines the Element range’s climate-resilient construction with a quieter, retreat-like residential character."
    ]
  },
  "abaco": {
    "title": "A substantial Caribbean-style residence with shaded verandas and island character.",
    "paragraphs": [
      "Abaco is a larger Caribbean-inspired Bauhu residence designed around family living, shaded outdoor space and a strong sense of arrival.",
      "The two-storey layout provides generous accommodation, broad verandas and the kind of covered exterior living expected in island climates.",
      "The model combines traditional Caribbean proportions with the precision, resilience and long-term durability of the Bauhu construction system."
    ]
  },
  "azure": {
    "title": "A two-bedroom Caribbean home built around resilient island living.",
    "paragraphs": [
      "Azure is a two-bedroom, two-bathroom Caribbean model positioned as a resilient, modular and sustainable home for island settings.",
      "The design brings together open living, efficient planning and a relaxed contemporary character suited to family use, guest accommodation or vacation rental.",
      "Like Bauhu’s wider Caribbean range, Azure is intended for fast on-site assembly, energy efficiency and long-term performance in storm-prone regions."
    ]
  },
  "angel": {
    "title": "A contemporary three-bedroom home with expansive covered outdoor living.",
    "paragraphs": [
      "Angel sits within Bauhu’s contemporary range of fast-assembly, energy-efficient and sustainable modular homes.",
      "The model is arranged as a three-bedroom residence with generous covered outdoor living and a clean modern architectural character.",
      "It is designed as a future-proof home for storm-prone regions, combining contemporary living with the resilience of Bauhu’s steel-framed system."
    ]
  },
  "jade": {
    "title": "A luxury contemporary villa with high-end interiors and generous glazing.",
    "paragraphs": [
      "Jade is a premium contemporary Bauhu villa with a luxury interior character and a strong focus on visual impact, natural light and open living.",
      "The old Bauhu Homes material presents Jade through high-end bedroom, bathroom and living spaces, with large windows, refined finishes and a sophisticated modern atmosphere.",
      "The model is positioned as a high-end residence that can be visualised and refined for an individual site while retaining the Bauhu construction principles of precision and resilience."
    ]
  },
  "amber": {
    "title": "A high-end contemporary villa with strong architectural presence.",
    "paragraphs": [
      "Amber belongs to Bauhu’s signature group of premium architect-designed homes with steel-framed, hurricane-resistant construction.",
      "The model is positioned as a four-bedroom contemporary villa, with generous accommodation, high-end living spaces and a refined architectural character.",
      "It is suited to clients wanting a more substantial Bauhu residence with strong visual presence, modern interiors and long-term climate resilience."
    ]
  },
  "topaz": {
    "title": "A substantial luxury villa with contemporary design and sustainable features.",
    "paragraphs": [
      "Topaz is a four-bedroom signature Bauhu residence with a larger luxury footprint and a contemporary architectural language.",
      "The old Bauhu Homes range places Topaz among premium homes designed around high-end accommodation, resilient steel-framed construction and modern living.",
      "The model is suited to substantial private residences where comfort, durability and a more distinctive design presence are priorities."
    ]
  },
  "moonstone": {
    "title": "A premium four-bedroom signature home with generous living space.",
    "paragraphs": [
      "Moonstone is a four-bedroom signature Bauhu residence positioned as a premium luxury model.",
      "The design offers a substantial floor area with the scale and comfort expected of a high-end private residence.",
      "As part of the signature range, Moonstone is framed around architect-designed luxury, steel construction and hurricane-resistant performance."
    ]
  },
  "cat-island": {
    "title": "An elevated contemporary island villa with a refined relaxed character.",
    "paragraphs": [
      "Cat Island is an elevated contemporary villa model suited to island living and site-specific refinement.",
      "The design is intended to provide an elegant, relaxed residential experience with strong connections to views, breezes and exterior space.",
      "Like other Bauhu island models, it can be adapted around foundations, orientation, glazing and local environmental requirements."
    ]
  },
  "caribbean-cottage": {
    "title": "A compact Caribbean cottage for guest use, rental or private retreat.",
    "paragraphs": [
      "Caribbean Cottage is a one-bedroom, one-bathroom model within Bauhu’s Caribbean Colonial range.",
      "The design is compact and efficient, suited to guest accommodation, vacation rental or a private retreat, with a covered outdoor living area extending the usable space.",
      "It combines a modest footprint with Bauhu’s future-proof, energy-efficient and climate-resilient modular construction approach."
    ]
  },
  "coconut-cottage": {
    "title": "A small Caribbean-style cottage with guest-house flexibility.",
    "paragraphs": [
      "Coconut Cottage is a compact two-bedroom Caribbean-style home with the character of a small guest cottage or secondary residence.",
      "The model is suited to relaxed island living, guest accommodation or rental use where a smaller footprint is preferred.",
      "It retains the practical advantages of Bauhu’s modular system: efficient delivery, durable materials and site-specific refinement."
    ]
  },
  "coconut-villa-2": {
    "title": "A two-bedroom island villa with balanced en-suite accommodation.",
    "paragraphs": [
      "Coconut Villa 2 is part of Bauhu’s Caribbean range, presented as a two-bedroom island villa with open-plan living and generous bedroom suites.",
      "The single-storey layout is suited to family living, vacation rental or guest accommodation, with a simple, balanced plan and strong indoor-outdoor potential.",
      "It combines classic island proportions with Bauhu’s resilient steel-framed construction and efficient modular delivery."
    ]
  },
  "coconut-villa-3": {
    "title": "A three-bedroom island villa with a flexible open-plan core.",
    "paragraphs": [
      "Coconut Villa 3 extends the same Caribbean villa language into a three-bedroom, three-bathroom arrangement.",
      "The plan is organised around open-plan living, with bedroom accommodation that makes the model suitable for family use, rental or small hospitality settings.",
      "It preserves the island-villa character of the Coconut range while using the Bauhu system for resilience, precision and efficient assembly."
    ]
  },
  "charlston": {
    "title": "An elevated Caribbean villa with wrap-around terrace living.",
    "paragraphs": [
      "The Charlston is a two-bedroom Caribbean villa with an elevated character and broad exterior terrace space.",
      "The old Bauhu Homes Caribbean range positions Charlston as a compact island residence with two bedrooms, two bathrooms and a generous wrap-around outdoor living arrangement.",
      "The model is suited to raised foundations, shaded verandas and climate-conscious island living."
    ]
  },
  "bahama-beach": {
    "title": "A three-bedroom coastal home with an island roof profile.",
    "paragraphs": [
      "Bahama Beach is a three-bedroom, two-bathroom Caribbean model with an island-style roof and a covered terrace.",
      "The design is compact but practical, bringing the living areas and bedrooms into close connection with shaded outdoor space.",
      "It sits within Bauhu’s Caribbean Colonial range of fast-assembly, energy-efficient homes for storm-prone regions."
    ]
  },
  "grapetree": {
    "title": "A well-proportioned three-bedroom Caribbean family home.",
    "paragraphs": [
      "Grapetree is a three-bedroom Caribbean model positioned as a well-proportioned family residence.",
      "The design is intended to provide a practical balance of indoor accommodation and outdoor living for island or coastal settings.",
      "As with the wider Caribbean range, the model is shaped around efficient assembly, durable materials and future-proof storm-resilient performance."
    ]
  },
  "skyline": {
    "title": "A large multi-storey contemporary villa with expansive glazing.",
    "paragraphs": [
      "Skyline is a large contemporary Bauhu villa with a multi-storey architectural character.",
      "The model is defined by a modern luxury scale, generous accommodation and expansive glazing intended to capture views and natural light.",
      "It is suited to larger private residences where dramatic architecture, open living and Bauhu’s resilient construction system are required."
    ]
  },
  "sailfish": {
    "title": "A luxury contemporary villa with covered terrace living.",
    "paragraphs": [
      "Sailfish is a three-bedroom contemporary Bauhu villa with a strong emphasis on outdoor living and covered terrace space.",
      "The model is positioned as a luxury residence with open living areas, contemporary styling and comfortable bedroom accommodation.",
      "It can be refined around site orientation, views, shading and the practical demands of building in island or coastal locations."
    ]
  },
  "barbados-blue": {
    "title": "A contemporary two-bedroom home with generous bedroom suites.",
    "paragraphs": [
      "Barbados Blue is a compact contemporary model arranged around two spacious bedroom suites.",
      "The design is suited to a private island home, guest residence or rental property where comfort, simplicity and resilience matter.",
      "It combines a manageable footprint with the durable, precision-engineered Bauhu construction approach."
    ]
  },
  "sunset-cove": {
    "title": "A modern two-bedroom oasis with a generous covered terrace.",
    "paragraphs": [
      "Sunset Cove is a hurricane-resistant, modular and sustainable two-bedroom, two-bathroom home.",
      "The design centres on spacious open-plan living, natural light and an intuitive connection between living, dining, kitchen and terrace areas.",
      "At the heart of the home is an expansive covered terrace that blurs the boundary between indoor and outdoor living, giving the model a relaxed island character."
    ]
  },
  "falcon-500": {
    "title": "An entry-level standalone Falcon home with a compact footprint.",
    "paragraphs": [
      "The Falcon 500 is an entry-level standalone home with two bedrooms, a shared bathroom and an open-plan kitchen, living and dining area.",
      "With a footprint of approximately 500 square feet, it is built to Bauhu’s hurricane-safe standards and can be supplied with a flat or pitched roof.",
      "The model is intended as a cost-efficient, climate-resilient housing option using Bauhu’s steel frame and durable composite envelope."
    ]
  },
  "falcon-900": {
    "title": "A compact Falcon home for family living, retreat or rental use.",
    "paragraphs": [
      "The Falcon 900 is a compact modular home available in two- or three-bedroom formats, with two bathrooms including one en suite.",
      "It is suited to family living, holiday retreat or vacation rental use, with a modern aesthetic and the option of a flat or pitched roof.",
      "The model combines affordability, practical interiors and Bauhu’s climate-resilient construction system."
    ]
  },
  "falcon-1800": {
    "title": "A single-storey duplex made from two self-contained Falcon homes.",
    "paragraphs": [
      "The Falcon 1800 is a single-storey duplex designed around two self-contained apartments of approximately 900 square feet each.",
      "Each unit can be configured with two or three bedrooms and includes two bathrooms, one en suite, plus fitted kitchens, bathroom fixtures and interior finishes.",
      "It is suited to affordable housing, rental development or multi-family use where speed, resilience and cost control are important."
    ]
  },
  "falcon-3500": {
    "title": "A two-storey Falcon building with four self-contained apartments.",
    "paragraphs": [
      "The Falcon 3500 is a two-storey building providing four self-contained apartments of approximately 900 square feet each.",
      "Each unit can be configured with two or three bedrooms, two bathrooms and complete interior fit-out, with a four-pitch roof option available.",
      "The model is intended for multi-family living, housing development or vacation rental, with a strong focus on affordability and practical resilience."
    ]
  },
  "horizon": {
    "title": "A three-bedroom contemporary home shaped around adaptable modern living.",
    "paragraphs": [
      "Horizon is a hurricane-resistant, modular and sustainable three-bedroom home intended to provide a refined contemporary living experience.",
      "The model can be built on grade or raised on an elevated foundation, allowing it to respond to local conditions, views and site constraints.",
      "It combines open living, resilience and adaptability, making it suitable for island, coastal or storm-prone locations."
    ]
  },
  "halo": {
    "title": "A well-proportioned contemporary home with covered veranda living.",
    "paragraphs": [
      "Halo is a three-bedroom contemporary model with a generous covered veranda and balanced residential proportions.",
      "The design supports indoor-outdoor living and can be refined around views, orientation and site-specific environmental requirements.",
      "It sits within Bauhu’s contemporary range of energy-efficient, fast-assembly homes for modern living in challenging climates."
    ]
  },
  "casita": {
    "title": "A two-bedroom modern oasis with covered pool-facing living.",
    "paragraphs": [
      "Casita is a hurricane-resistant, modular and sustainable two-bedroom, two-bathroom home.",
      "The old Bauhu Homes copy presents it as a modern oasis that brings together resilience, adaptability and eco-friendly design.",
      "The model can be built on grade or raised on an elevated foundation, making it adaptable to different site and climate conditions."
    ]
  },
  "chameleon": {
    "title": "A compact three-bedroom home with a distinctive covered terrace.",
    "paragraphs": [
      "Chameleon is a compact three-bedroom Bauhu model with a distinctive covered terrace and a modern residential character.",
      "The design is suited to family use, guest accommodation or vacation rental where a smaller footprint still needs strong indoor-outdoor living.",
      "As with other Bauhu homes, the model can be adjusted around site, orientation, foundation approach and local requirements."
    ]
  },
  "toucan": {
    "title": "A three-bedroom Caribbean home for resilient modern island living.",
    "paragraphs": [
      "Toucan is a hurricane-resistant, modular and sustainable three-bedroom, two-bathroom home.",
      "The model belongs to Bauhu’s Caribbean range, combining fast on-site assembly, energy efficiency and future-proof construction for storm-prone regions.",
      "It is suited to family living, second homes or rental use where a practical layout and resilient construction system are required."
    ]
  },
  "hawks-cay-villa": {
    "title": "An elegant contemporary villa with shade screens and strong façade character.",
    "paragraphs": [
      "Hawks Cay Villa is a contemporary Bauhu model with an elegant façade and shading elements that give the home a refined architectural presence.",
      "The design is suited to warm climates where privacy, solar control and indoor-outdoor comfort are important.",
      "It can be adapted to site conditions while retaining Bauhu’s resilient steel-framed construction and efficient delivery model."
    ]
  },
  "jimmy-hill": {
    "title": "Contemporary living, seamless indoor-outdoor design.",
    "paragraphs": [
      "Jimmy Hill is an architect-designed modular residence offering approximately 3,900 square feet of contemporary living space, with four or five bedrooms and a strong indoor-outdoor living concept.",
      "The design is defined by clean lines, expansive glass facades and open, light-filled spaces. Large sliding glass doors connect the open-plan ground floor with the outdoor living areas, while the upper level includes generously sized bedrooms with floor-to-ceiling windows.",
      "Sleek geometric forms, covered terraces and integrated shading elements give the home a refined modern character. Like all Bauhu homes, Jimmy Hill is designed around climate resilience, durable materials, energy efficiency and practical long-term comfort."
    ]
  },
  "firefly": {
    "title": "A spacious open-plan home with covered dining terrace living.",
    "paragraphs": [
      "Firefly is a three-bedroom, three-bathroom contemporary Bauhu home with a spacious open-plan arrangement and covered dining terrace.",
      "The design is suited to relaxed island living, with generous social space, strong exterior connections and a layout that supports indoor-outdoor use.",
      "It sits within Bauhu’s contemporary range of future-proof, energy-efficient modular homes for storm-prone regions."
    ]
  },
  "high-ridge": {
    "title": "A contemporary home with classic proportions and modern interiors.",
    "paragraphs": [
      "High Ridge is a three-bedroom contemporary Bauhu residence with a more classic architectural presence and modern interior planning.",
      "The model is suited to sites where a refined residential character, generous living space and long-term durability are important.",
      "As with other Bauhu models, the design can be refined around site orientation, local code requirements, glazing, shading and foundation strategy."
    ]
  },
  "jamaica": {
    "title": "A striking Caribbean villa beside the water.",
    "paragraphs": [
      "Jamaica is based on Xenjoh Villa, the first Bauhu Homes villa constructed in Jamaica. It is a substantial seven-bedroom, seven-and-a-half-bathroom residence that blends contemporary design with the natural beauty of its coastal setting.",
      "The villa is arranged around generous indoor and outdoor living, with a swimming pool, bold pergola structures providing shade, and sun deck areas positioned to make the most of Caribbean Sea views.",
      "Just steps from calm bay waters, the design combines resort-style outdoor living with the resilience and precision of the Bauhu construction system."
    ]
  },
  "providence": {
    "title": "A four-bedroom Caribbean home with spacious open-plan living.",
    "paragraphs": [
      "Providence is a four-bedroom Caribbean model with generous open-plan living and a practical family layout.",
      "The design is suited to island living, guest accommodation or rental use, with the scale to support longer stays and larger groups.",
      "It belongs to Bauhu’s Caribbean range of energy-efficient, future-proof modular homes for storm-prone regions."
    ]
  },
  "st-thomas": {
    "title": "A classic contemporary residence with flexible bedroom accommodation.",
    "paragraphs": [
      "St Thomas is a signature Bauhu model combining classic contemporary architecture with modern interior design.",
      "The old Bauhu Homes range lists it as a four- or five-bedroom residence with four or five bathrooms and a substantial 2,900 square foot footprint.",
      "The model is suited to larger private homes where site-specific refinement, views and resilient construction are central to the brief."
    ]
  },
  "quinta": {
    "title": "A luxurious contemporary residence with expansive open-plan living.",
    "paragraphs": [
      "Quinta is a luxurious Bauhu residence designed to offer elegance, resilience and generous open-plan living.",
      "The model can be supplied as shown or personalised by Bauhu’s architects around the intended location, local requirements and client brief.",
      "It is positioned as a substantial contemporary home with refined living spaces and the durability of Bauhu’s modular construction system."
    ]
  },
  "son-faro": {
    "title": "A sophisticated single-storey villa with relaxed contemporary living.",
    "paragraphs": [
      "Son Faro is a sophisticated single-storey Bauhu villa with a contemporary residential character.",
      "The design is suited to clients seeking a refined one-level home with open living and a strong relationship to exterior spaces.",
      "It can be developed around site orientation, views, finishes and the practical requirements of remote or island delivery."
    ]
  },
  "cap-dantibes": {
    "title": "A substantial signature villa with distinctive custom character.",
    "paragraphs": [
      "Cap D’Antibes is a substantial five-bedroom signature Bauhu residence with a luxury villa scale and distinctive design identity.",
      "The old Bauhu Homes signature range positions it among premium architect-designed homes with steel-framed, hurricane-resistant construction.",
      "It is suited to clients seeking a custom-feeling residence with generous accommodation, refined finishes and site-specific design development."
    ]
  },
  "casa-lavanda": {
    "title": "A large contemporary villa organised around terraces and pool-facing living.",
    "paragraphs": [
      "Casa Lavanda is a substantial four-bedroom, four-bathroom signature Bauhu residence with a large contemporary footprint.",
      "The model is arranged around generous living spaces, terraces, pool-facing areas and the kind of indoor-outdoor living expected of a high-end villa.",
      "It belongs to Bauhu’s premium architect-designed range, combining design flexibility with steel-framed, hurricane-resistant construction."
    ]
  },
  "grenada-luxe": {
    "title": "A compact luxury suite with roof-garden potential.",
    "paragraphs": [
      "Grenada Luxe is a compact one-bedroom Bauhu model suited to guest accommodation, rental use or a private pied-à-terre.",
      "The model is positioned within the contemporary range and can include roof-garden potential, giving a small footprint a stronger lifestyle character.",
      "It combines efficient planning, modern design and Bauhu’s resilient modular system."
    ]
  },
  "serenity-heights": {
    "title": "A contemporary two-storey home with optional guest accommodation.",
    "paragraphs": [
      "Serenity Heights is a four-bedroom contemporary Bauhu residence with a larger two-storey arrangement.",
      "The model is suited to substantial private living, with the flexibility for guest accommodation and site-specific refinement.",
      "It sits within the signature/luxury end of the Bauhu range, combining generous space with resilient steel-framed construction."
    ]
  },
  "nova": {
    "title": "A stylish modern villa designed for sloping sites.",
    "paragraphs": [
      "Nova is a stylish contemporary Bauhu villa designed with sloping sites in mind.",
      "The model is intended to work with challenging terrain while maintaining a modern residential character and generous private living space.",
      "It can be refined around site levels, views, foundation approach and local environmental requirements."
    ]
  },
  "north-beach": {
    "title": "A spacious contemporary home with distinctive architectural detailing.",
    "paragraphs": [
      "North Beach is a spacious contemporary Bauhu residence with distinctive architectural detailing and a larger family-home footprint.",
      "The design is suited to coastal and island settings where views, outdoor living and long-term resilience are central to the brief.",
      "It can be adapted around orientation, finishes, foundation strategy and the practical realities of delivery to remote sites."
    ]
  },
  "palmetto": {
    "title": "A classic island-style villa with generous accommodation.",
    "paragraphs": [
      "Palmetto is a three-bedroom Bauhu villa with a classic island-style character.",
      "The model provides generous living accommodation and can be refined around verandas, shade, views and local climate conditions.",
      "It combines a familiar island residential language with Bauhu’s precision-engineered, hurricane-resistant construction system."
    ]
  },
  "emerald-bay": {
    "title": "A multi-resident Bauhu building for resort or development settings.",
    "paragraphs": [
      "Emerald Bay is an architect-designed multi-resident Bauhu building with eight bedrooms and a larger condominium-style footprint.",
      "The model is suited to resort, development or multi-key residential use where repeatable, resilient accommodation is needed.",
      "It uses Bauhu’s design and construction approach to bring private-residence quality into a multi-unit format."
    ]
  },
  "red-hawk-ridge": {
    "title": "A contemporary ridge home with resilient family-scale accommodation.",
    "paragraphs": [
      "Red Hawk Ridge is a three-bedroom contemporary Bauhu residence with a substantial family-home footprint.",
      "The model is positioned for clients seeking distinctive design, generous living space and site-specific refinement.",
      "It sits within Bauhu’s contemporary range of climate-resilient, steel-framed homes for challenging locations."
    ]
  },
  "28": {
    "title": "A compact hospitality pod for rapid resort or rental deployment.",
    "paragraphs": [
      "Bauhu 28 is a compact hospitality pod designed for hotels, resorts, ADU use or Airbnb-style accommodation.",
      "The model provides a small, efficient guest unit with the emphasis on rapid deployment, durability and hurricane-safe construction.",
      "It is intended for operators who need repeatable, high-quality accommodation that can be delivered and assembled efficiently."
    ]
  },
  "36": {
    "title": "A one-bedroom hospitality pod with hotel-grade guest accommodation.",
    "paragraphs": [
      "Bauhu 36 is a hurricane-resistant hospitality pod with a bedroom and bathroom arrangement suited to resort or rental use.",
      "The model is designed for rapid deployment and repeatable accommodation, while retaining Bauhu’s architect-designed and precision-engineered approach.",
      "It is suitable for hotels, resorts, ADUs or standalone guest accommodation where durability and speed matter."
    ]
  },
  "39": {
    "title": "A compact en-suite hospitality pod for resort or guest use.",
    "paragraphs": [
      "Bauhu 39 is a hospitality pod with an en-suite bedroom layout and a compact, efficient footprint.",
      "The model is intended for hotel, resort, ADU or rental accommodation where rapid deployment and climate resilience are priorities.",
      "It combines guest comfort with the durability and precision of Bauhu’s modular construction system."
    ]
  },
  "44": {
    "title": "A two-bedroom hospitality pod for compact multi-guest accommodation.",
    "paragraphs": [
      "Bauhu 44 is a two-bedroom hospitality pod for resorts, hotels, ADU settings or compact rental accommodation.",
      "The model provides more flexible guest capacity while keeping the benefits of a small, repeatable modular unit.",
      "It is designed for fast deployment, hurricane-safe performance and efficient delivery to remote or high-risk locations."
    ]
  }
};

  const currentPublicSlug = root.dataset.modelSlug;
  const modelCopy = copyBySlug[currentPublicSlug];
  if (!modelCopy) return;

  const overview = root.querySelector('.home-overview');
  const heading = overview?.querySelector('h2');
  const copy = overview?.querySelector('.home-copy');
  if (!overview || !heading || !copy) return;

  heading.textContent = modelCopy.title;
  copy.replaceChildren(...modelCopy.paragraphs.map((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }));
})();