import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Hertz Brand Colors
        "hertz-yellow": "hsl(var(--hertz-yellow))",
        "hertz-gold": "hsl(var(--hertz-gold))",
        "hertz-navy": "hsl(var(--hertz-navy))",
        "hertz-dark-blue": "hsl(var(--hertz-dark-blue))",
        "hertz-light-blue": "hsl(var(--hertz-light-blue))",
        
        // Gradients
        "gradient-hertz": "var(--gradient-hertz)",
        
        // Status Colors
        "status-completed": "hsl(var(--status-completed))",
        "status-progress": "hsl(var(--status-progress))", 
        "status-pending": "hsl(var(--status-pending))",
        "status-warning": "hsl(var(--status-warning))",
        "status-error": "hsl(var(--status-error))",
        
        // Workflow UI Colors
        "workflow-step-completed": "hsl(var(--workflow-step-completed))",
        "workflow-step-completed-bg": "hsl(var(--workflow-step-completed-bg))",
        "workflow-step-active": "hsl(var(--workflow-step-active))",
        "workflow-step-progress": "hsl(var(--workflow-step-progress))",
        "workflow-step-progress-bg": "hsl(var(--workflow-step-progress-bg))",
        
        // Info Panels
        "info-bg": "hsl(var(--info-bg))",
        "info-text": "hsl(var(--info-text))",
        "info-border": "hsl(var(--info-border))",
        
        // Success Panels
        "success-bg": "hsl(var(--success-bg))",
        "success-text": "hsl(var(--success-text))",
        "success-border": "hsl(var(--success-border))",
        
        // Warning Panels
        "warning-bg": "hsl(var(--warning-bg))",
        "warning-text": "hsl(var(--warning-text))",
        "warning-border": "hsl(var(--warning-border))",
        
        // Priority Colors
        "priority-high": "hsl(var(--priority-high))",
        "priority-medium": "hsl(var(--priority-medium))",
        "priority-low": "hsl(var(--priority-low))",
        
        // Dashboard
        "dashboard-bg": "hsl(var(--dashboard-bg))",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
