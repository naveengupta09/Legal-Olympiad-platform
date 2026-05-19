import { useState } from "react"

// shadcn components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

function App() {
  const [name, setName] = useState("")
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      
      <Card className="w-full max-w-md shadow-xl">
        
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            🚀 Demo App
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Input */}
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Button */}
          <Button className="w-full">
            Submit
          </Button>

          {/* Badge */}
          <div className="text-center">
            <Badge variant="secondary">
              {name ? `Hello, ${name}` : "No name entered"}
            </Badge>
          </div>

          {/* Switch */}
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          {/* Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Open Modal
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Welcome 🎉</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-500">
                This is a demo modal using shadcn/ui.
              </p>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </div>
  )
}

export default App