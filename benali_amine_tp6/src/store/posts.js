export const posts = [
  {
    id: 1,
    title: "Introduction à Vue.js",
    tags: ["JavaScript", "Vue.js", "Frontend"],
    text: "Vue.js est un framework JavaScript progressif qui permet de construire des interfaces utilisateur interactives et réactives. Conçu pour être facile à prendre en main, il utilise un modèle basé sur les composants et une liaison bidirectionnelle des données, ce qui le rend puissant pour les applications dynamiques. Avec sa syntaxe intuitive et son écosystème riche, Vue.js est une excellente option pour les développeurs souhaitant créer des applications modernes et performantes."
  },
  {
    id: 2,
    title: "Les bases de Node.js",
    tags: ["JavaScript", "Node.js", "Backend"],
    text: "Node.js est un environnement d'exécution JavaScript qui fonctionne côté serveur, basé sur le moteur V8 de Google Chrome. Grâce à son architecture orientée événements et son modèle non bloquant, Node.js permet de gérer un grand nombre de requêtes simultanées, ce qui le rend idéal pour les applications en temps réel comme les chats, les API REST et les plateformes de streaming. Il est souvent utilisé avec Express.js pour simplifier le développement backend."
  },
  {
    id: 3,
    title: "Comment optimiser le SEO de son blog",
    tags: ["SEO", "Marketing", "Blogging"],
    text: "L'optimisation pour les moteurs de recherche (SEO) est essentielle pour améliorer la visibilité de votre blog et attirer plus de visiteurs. Pour cela, il est crucial d'utiliser des mots-clés pertinents, d'améliorer la vitesse de chargement du site et d'optimiser les balises meta. De plus, la création de contenu de qualité, l'obtention de backlinks et l'utilisation des données structurées contribuent à un meilleur référencement. Enfin, l'analyse des performances SEO à l'aide d'outils comme Google Search Console permet d'ajuster la stratégie en continu."
  },
  {
    id: 4,
    title: "Introduction à l'Intelligence Artificielle",
    tags: ["IA", "Machine Learning", "Technologie"],
    text: "L'intelligence artificielle (IA) est une branche de l'informatique qui vise à créer des systèmes capables d'exécuter des tâches normalement réalisées par des humains, comme la reconnaissance vocale, la vision par ordinateur et l'apprentissage automatique. L'IA repose sur des algorithmes d'apprentissage supervisé et non supervisé, et s'applique dans divers domaines, tels que la santé, la finance et la robotique. Avec les avancées technologiques, l'IA continue de transformer notre quotidien et ouvre la voie à de nouvelles innovations."
  },
  {
    id: 5,
    title: "Les avantages du développement full-stack",
    tags: ["Développement", "Full-Stack", "Programmation"],
    text: "Le développement full-stack permet aux développeurs de travailler à la fois sur la partie frontend et backend d'une application. Cette polyvalence offre une meilleure compréhension du projet global, une plus grande flexibilité et une réduction des coûts pour les entreprises. Les développeurs full-stack maîtrisent généralement des technologies comme JavaScript (avec Node.js et React/Vue.js), Python (Django/Flask) ou encore PHP (Laravel)."
  },
  {
    id: 6,
    title: "Pourquoi apprendre Python en 2024 ?",
    tags: ["Python", "Programmation", "Développement"],
    text: "Python est l'un des langages les plus populaires en raison de sa simplicité, de sa lisibilité et de sa polyvalence. Il est utilisé dans de nombreux domaines comme le développement web (Django, Flask), la science des données, l'IA, l'automatisation et la cybersécurité. Apprendre Python en 2024 est un excellent choix pour débuter en programmation ou pour évoluer dans une carrière technologique."
  },
  {
    id: 7,
    title: "Comment sécuriser une API REST ?",
    tags: ["Sécurité", "API", "Backend"],
    text: "Sécuriser une API REST est essentiel pour protéger les données et empêcher les attaques malveillantes. Les bonnes pratiques incluent l'utilisation de l'authentification (OAuth 2.0, JWT), le chiffrement des communications avec HTTPS, la limitation du nombre de requêtes (Rate Limiting) et l'implémentation de contrôles d'accès basés sur les rôles (RBAC). Il est également recommandé de surveiller l'API avec des outils de logging et d'analyse de sécurité."
  },
  {
    id: 8,
    title: "Les tendances du développement web en 2024",
    tags: ["Web", "Technologie", "Tendances"],
    text: "Le développement web évolue constamment et en 2024, certaines tendances se démarquent : l'adoption croissante des frameworks JavaScript modernes comme Next.js et Svelte, l'essor des Progressive Web Apps (PWA), l'amélioration de l'accessibilité numérique et l'intégration de l'IA pour automatiser certaines tâches. Les développeurs doivent rester à jour avec ces évolutions pour rester compétitifs sur le marché."
  }
];

export function addPost(post) {
  const newPost = {
    ...post,
    id: Math.max(...posts.map(p => p.id), 0) + 1
  };
  posts.push(newPost);
}

export function deletePost(postId) {
  const index = posts.findIndex(post => post.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
  }
}

export function updatePost(postId, updatedPost) {
  const index = posts.findIndex(post => post.id === postId);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updatedPost };
  }
} 