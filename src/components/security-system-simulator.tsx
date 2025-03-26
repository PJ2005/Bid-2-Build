"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Moon, Sun, AlertTriangle, Mail, Volume2, VolumeX } from "lucide-react"
import CodeDisplay from "./code-display"
import { esp32Code } from "@/lib/arduino-code"
import { ThemeToggle } from "./theme-toggle"

export default function SecuritySystemSimulator() {
  const [ldrValue, setLdrValue] = useState(1500)
  const [isNightMode, setIsNightMode] = useState(false)
  const [motionDetected, setMotionDetected] = useState(false)
  const [buzzerActive, setBuzzerActive] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [wifiConnected, setWifiConnected] = useState(false)
  const [buzzerTimer, setBuzzerTimer] = useState(0)

  // Simulate WiFi connection on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setWifiConnected(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Update night mode based on LDR value
  useEffect(() => {
    setIsNightMode(ldrValue < 1000)
  }, [ldrValue])

  // Handle motion detection and buzzer activation
  useEffect(() => {
    if (motionDetected && isNightMode) {
      setBuzzerActive(true)
      setEmailSent(true)
      setBuzzerTimer(10)
    }
  }, [motionDetected, isNightMode])

  // Buzzer timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (buzzerActive && buzzerTimer > 0) {
      interval = setInterval(() => {
        setBuzzerTimer((prev) => {
          if (prev <= 1) {
            setBuzzerActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (buzzerTimer === 0) {
      setBuzzerActive(false)
    }

    return () => clearInterval(interval)
  }, [buzzerActive, buzzerTimer])

  // Reset email sent status when motion is no longer detected
  useEffect(() => {
    if (!motionDetected) {
      setEmailSent(false)
    }
  }, [motionDetected])

  // State for modal visibility
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ESP32 night-time Security System Simulator</h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Simulation Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Simulation Panel</CardTitle>
            <CardDescription>Adjust sensors and see real-time responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* WiFi Connection Status */}
              <div className="flex items-center gap-2">
                <Wifi className={wifiConnected ? "text-green-500" : "text-gray-400"} />
                <span>WiFi Status:</span>
                {!wifiConnected ? (
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                  >
                    Connecting...
                  </motion.div>
                ) : (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    Connected
                  </Badge>
                )}
              </div>

              {/* LDR Sensor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isNightMode ? <Moon className="text-blue-500" /> : <Sun className="text-yellow-500" />}
                    <span>LDR Sensor (Light Intensity):</span>
                  </div>
                  <Badge
                    variant={isNightMode ? "outline" : "default"}
                    className={isNightMode ? "bg-blue-500/10 text-blue-500" : ""}
                  >
                    {isNightMode ? "Night Mode" : "Day Mode"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[ldrValue]}
                    min={0}
                    max={2000}
                    step={1}
                    onValueChange={(value) => setLdrValue(value[0])}
                    className="flex-1"
                  />
                  <span className="min-w-[60px] text-right">{ldrValue}</span>
                </div>
              </div>

              {/* PIR Sensor */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={motionDetected ? "text-red-500" : "text-gray-400"} />
                  <span>PIR Sensor (Motion Detection):</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{motionDetected ? "Motion Detected" : "No Motion"}</span>
                  <Switch checked={motionDetected} onCheckedChange={setMotionDetected} />
                </div>
              </div>

              {/* Buzzer Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {buzzerActive ? <Volume2 className="text-red-500" /> : <VolumeX className="text-gray-400" />}
                  <span>Buzzer Status:</span>
                </div>
                <Badge variant={buzzerActive ? "destructive" : "outline"}>
                  {buzzerActive ? `🚨 Active (${buzzerTimer}s)` : "🔇 Inactive"}
                </Badge>
              </div>

              {/* Email Alert */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className={emailSent ? "text-green-500" : "text-gray-400"} />
                  <span>Email Alert:</span>
                </div>
                <Badge
                  variant={emailSent ? "default" : "outline"}
                  className={emailSent ? "bg-green-500 text-white" : ""}
                >
                  {emailSent ? "📧 Alert Sent" : "No Alert"}
                </Badge>
              </div>

              {/* Alert Messages */}
              <AnimatePresence>
                {buzzerActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-red-500/10 border border-red-500 rounded-md text-red-500"
                  >
                    🚨 Intruder Alert! Activating Buzzer...
                  </motion.div>
                )}
                {emailSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-green-500/10 border border-green-500 rounded-md text-green-500"
                  >
                    Simulated Email: Intruder Alert Sent!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Circuit Diagram */}
        <Card>
          <CardHeader>
            <CardTitle>Circuit Diagram</CardTitle>
            <CardDescription>Security system circuit setup (click to zoom)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Circuit Diagram with modal functionality */}
            <div className="relative w-full">
              <img
                src="Circuit_diagram.png"
                alt="Circuit Diagram"
                className="rounded-md border border-border w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsImageModalOpen(true)}
              />
            </div>

            {/* Image Modal */}
            <AnimatePresence>
              {isImageModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                  onClick={() => setIsImageModalOpen(false)}
                >
                  <motion.img
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    src="Circuit_diagram.png"
                    alt="Circuit Diagram"
                    className="max-w-full max-h-[90vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Code, Output and Video */}
      <Tabs defaultValue="code" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="code">ESP32 Code</TabsTrigger>
          <TabsTrigger value="output">Output Image</TabsTrigger>
          <TabsTrigger value="video">Simulation Video</TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ESP32 Code</CardTitle>
              <CardDescription>Security system implementation code</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeDisplay code={esp32Code} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="output" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Output Image</CardTitle>
              <CardDescription>System output visualization</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <img
                src="Output.png"
                alt="Output Image"
                className="rounded-md border border-border w-full object-contain h-auto max-h-[500px]"
                width={948}
                height={728}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="video" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Video</CardTitle>
              <CardDescription>Watch the system in action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md flex items-center justify-center border border-border overflow-hidden">
                <video
                  src="output_video.mp4"
                  controls
                  className="w-full h-full object-contain"
                  poster="Output.png"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

