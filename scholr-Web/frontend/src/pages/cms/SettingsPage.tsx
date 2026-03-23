"use client";
import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/use-auth-store";
export default function SettingsPage() {
    const user = useAuthStore((state) => state.user);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [profileImage, setProfileImage] = useState(() => {
        if (typeof window === "undefined") {
            return "/placeholder.svg";
        }
        return localStorage.getItem("cms_profile_photo") || "/placeholder.svg";
    });
    const [pendingImage, setPendingImage] = useState<string | null>(null);
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [fullName, setFullName] = useState(user?.name || "Isabella Nash");
    const [email, setEmail] = useState(user?.email || "isabella@gmail.com");
    const [password, setPassword] = useState("password123");
    const [address, setAddress] = useState("5295 Gaylord Walks Apt. 110");
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        localStorage.setItem("cms_profile_photo", profileImage);
        window.dispatchEvent(new CustomEvent("cms-profile-photo-updated", { detail: profileImage }));
    }, [profileImage]);
    const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        event.target.value = "";
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setPendingImage(reader.result);
                setIsCropOpen(true);
            }
        };
        reader.readAsDataURL(file);
    };
    const handleCropCancel = () => {
        setIsCropOpen(false);
        setPendingImage(null);
        setDragOffset({ x: 0, y: 0 });
        setDragStart(null);
        setZoom(1);
    };
    const handleCropSave = () => {
        if (pendingImage) {
            setProfileImage(pendingImage);
        }
        setIsCropOpen(false);
        setPendingImage(null);
        setDragOffset({ x: 0, y: 0 });
        setDragStart(null);
        setZoom(1);
    };
    return (<div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>

      <Card className="max-w-2xl">
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border border-slate-200 bg-slate-100 shadow-sm overflow-hidden">
                <img src={profileImage} alt="Profile" className="h-full w-full object-cover"/>
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
                <Camera className="h-4 w-4"/>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden"/>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
              <p className="text-sm text-slate-500">Update your personal information</p>
            </div>
          </div>

          {isCropOpen && pendingImage ? (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-900">Adjust your profile photo</h3>
                  <p className="mt-1 text-sm text-slate-500">Preview inside the circle below.</p>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative h-64 w-64 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                    <div className="absolute inset-0 bg-black/30"></div>
                    <img
                      src={pendingImage}
                      alt="Profile preview"
                      className="absolute left-1/2 top-1/2 max-w-none select-none"
                      style={{
                        transform: `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px)) scale(${zoom})`,
                        cursor: "grab",
                      }}
                      draggable={false}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setDragStart({ x: event.clientX - dragOffset.x, y: event.clientY - dragOffset.y });
                      }}
                      onMouseMove={(event) => {
                        if (!dragStart) {
                          return;
                        }
                        setDragOffset({
                          x: event.clientX - dragStart.x,
                          y: event.clientY - dragStart.y,
                        });
                      }}
                      onMouseUp={() => setDragStart(null)}
                      onMouseLeave={() => setDragStart(null)}
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-full border-4 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]"></div>
                  </div>
                </div>
                <div className="mt-6">
                  <Label className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Zoom</Label>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="mt-2 w-full accent-[#112F68]"
                  />
                </div>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button type="button" onClick={handleCropCancel} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600">
                    Cancel
                  </button>
                  <button type="button" onClick={handleCropSave} className="rounded-full bg-[#112F68] px-5 py-2 text-sm font-semibold text-white">
                    Use Photo
                  </button>
                </div>
              </div>
            </div>) : null}

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-none border-x-0 border-t-0 px-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"/>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none border-x-0 border-t-0 px-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"/>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-none border-x-0 border-t-0 px-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"/>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-none border-x-0 border-t-0 px-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"/>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Notifications</p>
              <p className="text-sm text-slate-500">Receive system updates and alerts</p>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled}/>
          </div>
        </CardContent>
      </Card>
    </div>);
}
