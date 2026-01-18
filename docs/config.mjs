import { defaultTheme } from "@vuepress/theme-default";
import { viteBundler } from "@vuepress/bundler-vite";
import { markdownChartPlugin } from "@vuepress/plugin-markdown-chart";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));

export default {
  temp: resolve(configDir, "temp"),
  cache: resolve(configDir, "cache"),
  pagePatterns: [
    "index.md",
    "404.md",
    "en/**/*.md",
    "fr/**/*.md"
  ],
  locales: {
    "/en/": {
      lang: "en-US",
      title: "MixServer",
      description: "Infrastructure documentation"
    },
    "/fr/": {
      lang: "fr-FR",
      title: "MixServer",
      description: "Documentation d'infrastructure"
    }
  },
  bundler: viteBundler(),
  plugins: [
    markdownChartPlugin({
      mermaid: true
    })
  ],
  theme: defaultTheme({
    localeDropdown: true,
    themePlugins: {
      git: false,
      linksCheck: false
    },
    locales: {
      "/en/": {
        navbar: [
          { text: "Home", link: "/en/" },
          { text: "Architecture", link: "/en/guide/architecture.html" },
          { text: "Automation", link: "/en/automation/ansible-base.html" },
          { text: "Providers", link: "/en/providers/hetzner.html" },
          { text: "Operations", link: "/en/operations/failover.html" }
        ],
        sidebar: [
          {
            text: "Guide",
            children: [
              "/en/guide/architecture.md",
              "/en/guide/preparation.md"
            ]
          },
          {
            text: "Automation",
            children: [
              "/en/automation/ansible-base.md",
              "/en/automation/ansible-k3s.md"
            ]
          },
          {
            text: "Providers",
            children: [
              "/en/providers/hetzner.md",
              "/en/providers/cloudflare.md"
            ]
          },
          {
            text: "Operations",
            children: [
              "/en/operations/failover.md"
            ]
          }
        ]
      },
      "/fr/": {
        navbar: [
          { text: "Accueil", link: "/fr/" },
          { text: "Architecture", link: "/fr/guide/architecture.html" },
          { text: "Automatisation", link: "/fr/automation/ansible-base.html" },
          { text: "Fournisseurs", link: "/fr/providers/hetzner.html" },
          { text: "Opérations", link: "/fr/operations/failover.html" }
        ],
        sidebar: [
          {
            text: "Guide",
            children: [
              "/fr/guide/architecture.md",
              "/fr/guide/preparation.md"
            ]
          },
          {
            text: "Automatisation",
            children: [
              "/fr/automation/ansible-base.md",
              "/fr/automation/ansible-k3s.md"
            ]
          },
          {
            text: "Fournisseurs",
            children: [
              "/fr/providers/hetzner.md",
              "/fr/providers/cloudflare.md"
            ]
          },
          {
            text: "Opérations",
            children: [
              "/fr/operations/failover.md"
            ]
          }
        ]
      }
    }
  })
};
