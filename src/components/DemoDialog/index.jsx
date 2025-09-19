import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import LoginVisualPanel from "@/components/DemoDialog/LoginVisualPanel";
import LoginForm from "@/components/DemoDialog/LoginForm";
import ScheduleDemoForm from "@/components/DemoDialog/ScheduleDemoForm";
import DialogTabs from "@/components/DemoDialog/DialogTabs";

const DemoDialog = ({ open, onOpenChange, initialFlow = "login" }) => {
  // Definir las pestañas disponibles aquí para controlar centralizadamente
  const availableDialogTabs = ["acceder", "registrarse", "agendar"];

  // Forzar "acceder" como tab inicial si "registrarse" no está disponible o si initialFlow es signup
  const defaultActiveTab = (initialFlow === "signup" && availableDialogTabs.includes("registrarse")) ? "registrarse" : "acceder";
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (open) {
      // Si la pestaña inicial deseada no está disponible, cambiar a "acceder"
      if (initialFlow === "signup" && !availableDialogTabs.includes("registrarse")) {
        setActiveTab("acceder");
      } else {
        setActiveTab(initialFlow === "signup" ? "registrarse" : "acceder");
      }
      setAuthError(null);
    }
  }, [open, initialFlow]);

  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setAuthError(null);
    }
  };

  const handleSignUpSuccess = () => {
    if (availableDialogTabs.includes("acceder")) {
      setActiveTab("acceder"); 
    }
    setAuthError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1100px] bg-white p-0 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[600px] md:min-h-[650px] lg:min-h-[700px]">
          <LoginVisualPanel />
          <div className="w-full md:w-3/5 p-8 md:p-10 lg:p-12 overflow-y-auto max-h-[calc(100vh-100px)] md:max-h-full flex flex-col bg-white rounded-r-xl md:rounded-r-xl md:rounded-l-none">
            <DialogTabs activeTab={activeTab} setActiveTab={setActiveTab} setLoginError={setAuthError} availableTabs={availableDialogTabs} />
            <div className="flex-grow mt-8">
              {activeTab === "acceder" && (
                <motion.div 
                  key="accederForm"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  <LoginForm 
                    setLoginErrorExt={setAuthError} 
                    loginErrorExt={authError} 
                    onOpenChange={onOpenChange} 
                    isSignUpFlow={false}
                  />
                </motion.div>
              )}
              {activeTab === "registrarse" && availableDialogTabs.includes("registrarse") && ( // Solo renderizar si la pestaña está disponible
                 <motion.div 
                  key="registrarseForm"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  <LoginForm 
                    setLoginErrorExt={setAuthError} 
                    loginErrorExt={authError} 
                    onOpenChange={onOpenChange} 
                    isSignUpFlow={true}
                    onSignUpSuccess={handleSignUpSuccess}
                  />
                </motion.div>
              )}
              {activeTab === "agendar" && (
                <motion.div 
                  key="agendarForm"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  <ScheduleDemoForm onOpenChange={onOpenChange} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoDialog;