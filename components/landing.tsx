"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Bot,
  Zap,
  Shield,
  BarChart3,
  MessageSquare,
  Users,
  CheckCircle,
  Star,
  Play,
  FileText,
  Headphones,
  Mail,
  Phone,
  Clock,
  Globe,
  Cpu,
  Database,
} from "lucide-react"

interface LandingProps {
  onGetStarted: () => void
  onLogin: () => void
}

const features = [
  {
    icon: Bot,
    title: "Agentes IA Inteligentes",
    description: "Crea y gestiona múltiples agentes especializados con diferentes personalidades y habilidades",
  },
  {
    icon: Zap,
    title: "Integración LLM",
    description: "Definimos tu modelo de proceso y lo automatizamos de manera avanzada para que utilices los mejores modelos LLM",
  },
  {
    icon: BarChart3,
    title: "Analytics Avanzados",
    description: "Métricas detalladas y análisis de rendimiento en tiempo real",
  },
  {
    icon: Shield,
    title: "Seguridad Empresarial",
    description: "Protección de datos y cumplimiento de estándares de seguridad",
  },
  {
    icon: MessageSquare,
    title: "Chat Multicanal",
    description: "Soporte para múltiples canales de comunicación y plataformas",
  },
  {
    icon: Users,
    title: "Gestión de Equipos",
    description: "Administra usuarios, roles y permisos de manera centralizada",
  },
]

const useCases = [
  {
    title: "Atención al Cliente",
    description: "Automatiza el soporte técnico y mejora la satisfacción del cliente",
    icon: Headphones,
    benefits: ["Respuesta 24/7", "Reducción de costos", "Mayor satisfacción"],
  },
  {
    title: "Ventas y Marketing",
    description: "Genera leads, califica prospectos y cierra más ventas",
    icon: BarChart3,
    benefits: ["Generación de leads", "Calificación automática", "Seguimiento personalizado"],
  },
  {
    title: "Recursos Humanos",
    description: "Automatiza procesos de reclutamiento y gestión de empleados",
    icon: Users,
    benefits: ["Screening automático", "Onboarding eficiente", "Gestión de consultas"],
  },
  {
    title: "Educación y Formación",
    description: "Crea tutores virtuales y asistentes educativos personalizados",
    icon: FileText,
    benefits: ["Tutoría personalizada", "Evaluación automática", "Contenido adaptativo"],
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mes",
    description: "Perfect para pequeños equipos",
    features: [
      "Hasta 3 agentes IA",
      "1,000 consultas/mes",
      "Soporte por email",
      "Analytics básicos",
      "Integración N8N",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/mes",
    description: "Ideal para empresas en crecimiento",
    features: [
      "Hasta 10 agentes IA",
      "10,000 consultas/mes",
      "Soporte prioritario",
      "Analytics avanzados",
      "Integración N8N",
      "API personalizada",
      "Roles y permisos",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/mes",
    description: "Para organizaciones grandes",
    features: [
      "Agentes IA ilimitados",
      "Consultas ilimitadas",
      "Soporte 24/7",
      "Analytics empresariales",
      "Integración N8N",
      "API personalizada",
      "Roles y permisos",
      "SLA garantizado",
      "Implementación dedicada",
    ],
    popular: false,
  },
]

const agents = [
  {
    id: "support-agent",
    name: "Agente de Soporte",
    description: "Especializado en resolver consultas técnicas y problemas de usuarios",
    model: "GPT-4",
    capabilities: [
      "Resolución de problemas técnicos",
      "Documentación de incidencias",
      "Escalamiento inteligente",
      "Base de conocimientos integrada",
    ],
    apiEndpoints: [
      { method: "POST", endpoint: "/api/agents/support/chat", description: "Iniciar conversación" },
      { method: "GET", endpoint: "/api/agents/support/status", description: "Estado del agente" },
    ],
  },
  {
    id: "sales-agent",
    name: "Agente de Ventas",
    description: "Optimizado para generar leads y cerrar ventas de manera efectiva",
    model: "GPT-3.5",
    capabilities: [
      "Calificación de leads",
      "Presentación de productos",
      "Manejo de objeciones",
      "Seguimiento automatizado",
    ],
    apiEndpoints: [
      { method: "POST", endpoint: "/api/agents/sales/chat", description: "Iniciar conversación de ventas" },
      { method: "GET", endpoint: "/api/agents/sales/leads", description: "Obtener leads generados" },
    ],
  },
  {
    id: "faq-agent",
    name: "Agente FAQ",
    description: "Responde preguntas frecuentes de manera rápida y precisa",
    model: "Claude-3",
    capabilities: ["Base de conocimientos FAQ", "Respuestas instantáneas", "Aprendizaje continuo", "Múltiples idiomas"],
    apiEndpoints: [
      { method: "POST", endpoint: "/api/agents/faq/query", description: "Consultar FAQ" },
      { method: "PUT", endpoint: "/api/agents/faq/update", description: "Actualizar base de conocimientos" },
    ],
  },
]

export function Landing({ onGetStarted, onLogin }: LandingProps) {
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [supportSubmitted, setSupportSubmitted] = useState(false)

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular envío
    setSupportSubmitted(true)
    setTimeout(() => {
      setSupportSubmitted(false)
      setSupportForm({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-secondary backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-primary-foreground" />
              <span className="text-xl font-bold text-white">Agentes IA ByBinary</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-primary-foreground hover:text-gray-500 transition-colors text-sm">
                Características
              </a>
              <a href="#use-cases" className="text-primary-foreground hover:text-gray-500 transition-colors text-sm">
                Casos de Uso
              </a>
              <a href="#pricing" className="text-primary-foreground hover:text-gray-500 transition-colors text-sm">
                Precios
              </a>
              <a href="#docs" className="text-primary-foreground hover:text-gray-500 transition-colors text-sm">
                Documentación
              </a>
              <a href="#support" className="text-primary-foreground hover:text-gray-500 transition-colors text-sm">
                Soporte
              </a>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={onLogin}>
                Iniciar Sesión
              </Button>
              <Button onClick={onGetStarted}>Comenzar Gratis</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Potencia tu negocio con <span className="text-primary">Agentes IA Inteligentes</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Crea, gestiona y optimiza agentes de inteligencia artificial especializados para automatizar tu atención
              al cliente, ventas y soporte técnico.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onGetStarted} className="gap-2">
                <Play className="h-5 w-5" />
                Comenzar Gratis
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <FileText className="h-5 w-5" />
                Ver Demo
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Disponibilidad</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Empresas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Consultas/mes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Características Poderosas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para crear y gestionar agentes IA de clase empresarial
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Casos de Uso</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre cómo diferentes industrias están transformando sus operaciones
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{useCase.title}</CardTitle>
                        <CardDescription>{useCase.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {useCase.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Precios Transparentes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a las necesidades de tu negocio
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-0 shadow-lg ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Más Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} onClick={onGetStarted}>
                    Comenzar Ahora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Documentación de Agentes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Guías completas y referencias de API para cada tipo de agente
            </p>
          </div>
          <div className="space-y-8">
            {agents.map((agent, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        {agent.name}
                      </CardTitle>
                      <CardDescription>{agent.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{agent.model}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="capabilities" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="capabilities">Capacidades</TabsTrigger>
                      <TabsTrigger value="api">API Reference</TabsTrigger>
                      <TabsTrigger value="examples">Ejemplos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="capabilities" className="mt-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {agent.capabilities.map((capability, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                            <Cpu className="h-4 w-4 text-primary" />
                            <span className="text-sm">{capability}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="api" className="mt-4">
                      <div className="space-y-4">
                        {agent.apiEndpoints.map((endpoint, idx) => (
                          <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={endpoint.method === "POST" ? "default" : "secondary"}>
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm font-mono">{endpoint.endpoint}</code>
                            </div>
                            <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="examples" className="mt-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Ejemplo de uso:</h4>
                        <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                          <code>{`curl -X POST "${agent.apiEndpoints[0]?.endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "message": "Hola, necesito ayuda",
    "user_id": "user123",
    "session_id": "session456"
  }'`}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Soporte Técnico</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Contacta con nuestro equipo de soporte
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-primary" />
                    Canales de Soporte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">support@aiagents.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Teléfono</div>
                      <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Horario</div>
                      <div className="text-sm text-muted-foreground">Lun-Vie 9:00-18:00 EST</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Chat en Vivo</div>
                      <div className="text-sm text-muted-foreground">Disponible 24/7</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recursos Adicionales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <FileText className="h-4 w-4" />
                    Centro de Ayuda
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Globe className="h-4 w-4" />
                    Comunidad
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Database className="h-4 w-4" />
                    Estado del Sistema
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Envíanos un Mensaje</CardTitle>
                <CardDescription>Completa el formulario y te responderemos en menos de 24 horas</CardDescription>
              </CardHeader>
              <CardContent>
                {supportSubmitted ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      ¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos pronto.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre *</label>
                        <Input
                          required
                          value={supportForm.name}
                          onChange={(e) => setSupportForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email *</label>
                        <Input
                          type="email"
                          required
                          value={supportForm.email}
                          onChange={(e) => setSupportForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Asunto *</label>
                      <Input
                        required
                        value={supportForm.subject}
                        onChange={(e) => setSupportForm((prev) => ({ ...prev, subject: e.target.value }))}
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mensaje *</label>
                      <Textarea
                        required
                        value={supportForm.message}
                        onChange={(e) => setSupportForm((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Describe tu consulta o problema..."
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      <Mail className="h-4 w-4" />
                      Enviar Mensaje
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-bold">AI Agents Platform</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                La plataforma líder para crear y gestionar agentes de inteligencia artificial empresariales.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#docs" className="hover:text-foreground transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Carreras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#support" className="hover:text-foreground transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Comunidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Estado del Sistema
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Términos de Servicio
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AI Agents Platform. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
