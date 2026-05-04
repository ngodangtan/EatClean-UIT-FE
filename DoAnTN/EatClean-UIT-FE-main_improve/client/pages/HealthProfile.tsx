import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Save, X } from "lucide-react";
import { API_BASE } from "@shared/api";
import { useToast } from "@/hooks/use-toast";

interface Disease {
  key: string;
}

interface DiseaseOption {
  key: string;
  name: string;
}

interface HealthProfileData {
  activityLevel?: string;
  sleepDuration?: number;
  dietPreference?: string;
  mealsPerDay?: number;
  cuisinePreference?: string[];
  diseases?: Disease[];
}

export default function HealthProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [weight, setWeight] = useState<number | null>(null);
  const [healthProfile, setHealthProfile] = useState<HealthProfileData | null>(null);
  const [diseaseOptions, setDiseaseOptions] = useState<DiseaseOption[]>([]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editWeight, setEditWeight] = useState<string>("");
  const [editProfile, setEditProfile] = useState<HealthProfileData>({});
  const [editCuisinesStr, setEditCuisinesStr] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const [profileRes, healthRes, diseaseRes] = await Promise.all([
        fetch(`${API_BASE}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/health-profile`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/diseases`)
      ]);

      let w = null;
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.currentWeight) w = profileData.currentWeight;
      }

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHealthProfile(healthData);
        // User weight from health API might be available too
        if (healthData.currentWeight) w = healthData.currentWeight;
      } else if (healthRes.status !== 404) {
        throw new Error("Failed to fetch health profile");
      }
      
      setWeight(w);

      if (diseaseRes.ok) {
        const diseaseData = await diseaseRes.json();
        if (diseaseData.success && diseaseData.data) {
          setDiseaseOptions(diseaseData.data);
        }
      }
    } catch (err) {
      console.error("Error fetching health profile:", err);
      setError("Có lỗi xảy ra khi tải hồ sơ sức khỏe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleEditClick = () => {
    setEditWeight(weight ? weight.toString() : "");
    setEditProfile(healthProfile || {
      activityLevel: "sedentary",
      sleepDuration: 7,
      dietPreference: "balanced",
      mealsPerDay: 3,
      diseases: []
    });
    setEditCuisinesStr((healthProfile?.cuisinePreference || []).join(", "));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      
      if (editWeight && !isNaN(parseFloat(editWeight))) {
        await fetch(`${API_BASE}/api/auth/profile`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ currentWeight: parseFloat(editWeight) })
        });
      }

      const payload: HealthProfileData = {
        ...editProfile,
        sleepDuration: editProfile.sleepDuration ? Number(editProfile.sleepDuration) : undefined,
        mealsPerDay: editProfile.mealsPerDay ? Number(editProfile.mealsPerDay) : undefined,
        cuisinePreference: editCuisinesStr.split(",").map(s => s.trim()).filter(s => s.length > 0)
      };

      const healthRes = await fetch(`${API_BASE}/api/health-profile`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!healthRes.ok) throw new Error("Failed to save health profile");

      toast({
        title: "Thành công",
        description: "Hồ sơ sức khỏe đã được cập nhật.",
      });

      setIsEditing(false);
      await fetchData(); 
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể lưu hồ sơ sức khỏe. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleDisease = (key: string) => {
    const current = editProfile.diseases || [];
    const exists = current.find(d => d.key === key);
    if (exists) {
      setEditProfile({ ...editProfile, diseases: current.filter(d => d.key !== key) });
    } else {
      setEditProfile({ ...editProfile, diseases: [...current, { key }] });
    }
  };

  const translateActivityLevel = (level?: string) => {
    const map: Record<string, string> = {
      sedentary: "Ít vận động",
      "lightly-active": "Vận động nhẹ",
      "moderately-active": "Vận động vừa",
      "very-active": "Vận động nhiều",
      "extremely-active": "Vận động rất nhiều"
    };
    return level ? (map[level] || level) : "Chưa cập nhật";
  };

  const formatSleepDuration = (hours?: number) => {
    if (!hours) return "Chưa cập nhật";
    if (hours < 6) return "Dưới 6 giờ";
    if (hours <= 8) return "6 - 8 giờ";
    return "Trên 8 giờ";
  };

  const translateDiet = (diet?: string) => {
    if (!diet) return "Chưa cập nhật";
    const map: Record<string, string> = {
      balanced: "Cân bằng",
      vegetarian: "Ăn chay",
      vegan: "Thuần chay",
      keto: "Keto"
    };
    return map[diet] || (diet.charAt(0).toUpperCase() + diet.slice(1));
  };

  const getDiseaseName = (key: string) => {
    const found = diseaseOptions.find(d => d.key === key);
    if (found) return found.name;
    const map: Record<string, string> = {
      diabetes: "Tiểu đường",
      hypertension: "Huyết áp cao",
      heart_disease: "Bệnh tim mạch"
    };
    return map[key] || (key.charAt(0).toUpperCase() + key.slice(1));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] relative overflow-hidden flex flex-col font-sans">
      <Header />
      <main className="flex-1 pt-40 sm:pt-48 lg:pt-56 pb-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Top Bar matching mobile style */}
          <div className="flex items-center justify-between mb-10 relative">
            <button onClick={() => isEditing ? handleCancel() : navigate(-1)} className="p-3 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors z-10">
              {isEditing ? <X className="w-6 h-6 text-black" /> : <ChevronLeft className="w-6 h-6 text-black" />}
            </button>
            <h1 className="text-[22px] font-bold text-center absolute left-0 right-0">Hồ sơ sức khỏe</h1>
            
            {!isEditing ? (
              <button 
                onClick={handleEditClick}
                className="text-[#139B4B] font-semibold text-[17px] px-5 py-2.5 bg-white border border-[#139B4B]/20 shadow-sm rounded-full hover:bg-[#F1FAF4] transition-colors z-10"
              >
                Chỉnh sửa
              </button>
            ) : (
              <button 
                onClick={handleSave}
                disabled={saving}
                className="text-white font-semibold text-[17px] px-5 py-2.5 bg-[#139B4B] shadow-sm shadow-[#139B4B]/30 rounded-full hover:bg-[#108A42] transition-colors z-10 disabled:opacity-70 flex items-center gap-2"
              >
                {saving ? "Đang lưu..." : <><Save className="w-4 h-4"/> Lưu</>}
              </button>
            )}
          </div>

          {loading ? (
             <div className="text-center py-20 text-gray-500 font-medium text-lg">Đang tải dữ liệu...</div>
          ) : error ? (
             <div className="text-center py-20 text-red-500 font-medium text-lg">{error}</div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Hoạt động & Lối sống */}
              <section>
                <h2 className="text-[19px] font-bold text-gray-400 mb-4 px-2">Hoạt động & Lối sống</h2>
                <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-50 p-6 md:px-8">
                  <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800 text-[17px] font-medium w-1/2">Mức độ vận động</span>
                    {isEditing ? (
                      <select 
                        value={editProfile.activityLevel || "sedentary"}
                        onChange={e => setEditProfile({...editProfile, activityLevel: e.target.value})}
                        className="w-1/2 text-right text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#139B4B]/30"
                      >
                        <option value="sedentary">Ít vận động</option>
                        <option value="lightly-active">Vận động nhẹ</option>
                        <option value="moderately-active">Vận động vừa</option>
                        <option value="very-active">Vận động nhiều</option>
                        <option value="extremely-active">Vận động rất nhiều</option>
                      </select>
                    ) : (
                      <span className="text-gray-500 text-[17px]">{translateActivityLevel(healthProfile?.activityLevel)}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800 text-[17px] font-medium w-1/2">Thời gian ngủ (giờ)</span>
                    {isEditing ? (
                      <input 
                        type="number"
                        min="1" max="24"
                        value={editProfile.sleepDuration || ""}
                        onChange={e => setEditProfile({...editProfile, sleepDuration: Number(e.target.value)})}
                        className="w-1/2 text-right text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#139B4B]/30"
                        placeholder="VD: 7"
                      />
                    ) : (
                      <span className="text-gray-500 text-[17px]">{formatSleepDuration(healthProfile?.sleepDuration)}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800 text-[17px] font-medium w-1/2">Cân nặng hiện tại (kg)</span>
                    {isEditing ? (
                      <input 
                        type="number" step="0.1"
                        value={editWeight}
                        onChange={e => setEditWeight(e.target.value)}
                        className="w-1/2 text-right text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#139B4B]/30"
                        placeholder="VD: 65.5"
                      />
                    ) : (
                      <span className="text-gray-500 text-[17px]">{weight ? `${weight.toFixed(1)} kg` : "Chưa cập nhật"}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Chế độ ăn & Ẩm thực */}
              <section>
                <h2 className="text-[19px] font-bold text-gray-400 mb-4 px-2">Chế độ ăn & Ẩm thực</h2>
                <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-50 p-6 md:px-8">
                  <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800 text-[17px] font-medium w-1/2">Chế độ ăn ưu tiên</span>
                    {isEditing ? (
                      <select 
                        value={editProfile.dietPreference || "balanced"}
                        onChange={e => setEditProfile({...editProfile, dietPreference: e.target.value})}
                        className="w-1/2 text-right text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#139B4B]/30"
                      >
                        <option value="balanced">Cân bằng</option>
                        <option value="vegetarian">Ăn chay</option>
                        <option value="vegan">Thuần chay</option>
                        <option value="keto">Keto</option>
                      </select>
                    ) : (
                      <span className="text-gray-500 text-[17px]">{translateDiet(healthProfile?.dietPreference)}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800 text-[17px] font-medium w-1/2">Số bữa mỗi ngày</span>
                    {isEditing ? (
                      <input 
                        type="number" min="1" max="6"
                        value={editProfile.mealsPerDay || ""}
                        onChange={e => setEditProfile({...editProfile, mealsPerDay: Number(e.target.value)})}
                        className="w-1/2 text-right text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#139B4B]/30"
                        placeholder="VD: 3"
                      />
                    ) : (
                      <span className="text-gray-500 text-[17px]">{healthProfile?.mealsPerDay ? `${healthProfile.mealsPerDay} bữa` : "Chưa cập nhật"}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800 text-[17px] font-medium w-1/3">Ẩm thực ưa thích</span>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editCuisinesStr}
                        onChange={e => setEditCuisinesStr(e.target.value)}
                        className="w-2/3 text-right text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#139B4B]/30"
                        placeholder="VD: Vietnamese, Chinese"
                      />
                    ) : (
                      <span className="text-gray-500 text-[17px] text-right max-w-[60%]">
                        {healthProfile?.cuisinePreference && healthProfile.cuisinePreference.length > 0
                          ? healthProfile.cuisinePreference.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")
                          : "Chưa cập nhật"}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* Tình trạng sức khỏe */}
              <section>
                <h2 className="text-[19px] font-bold text-gray-400 mb-4 px-2">Tình trạng sức khỏe</h2>
                <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-50 p-6 md:px-8">
                  {isEditing ? (
                    <div className="space-y-4 py-2">
                      {diseaseOptions.length > 0 ? diseaseOptions.map(disease => {
                        const isChecked = !!(editProfile.diseases || []).find(d => d.key === disease.key);
                        return (
                          <label key={disease.key} className="flex items-center space-x-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={isChecked} 
                              onChange={() => toggleDisease(disease.key)} 
                            />
                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-[#139B4B] border-[#139B4B]' : 'bg-white border-gray-300 group-hover:border-[#139B4B]'}`}>
                               {isChecked && <div className="w-3 h-3 bg-white rounded-sm"></div>}
                            </div>
                            <span className="text-gray-800 text-[17px] font-medium">{disease.name}</span>
                          </label>
                        );
                      }) : (
                         <div className="text-gray-500 italic">Đang tải danh sách bệnh lý...</div>
                      )}
                    </div>
                  ) : (
                    healthProfile?.diseases && healthProfile.diseases.length > 0 ? (
                      <div className="space-y-0">
                        {healthProfile.diseases.map((disease, idx) => (
                          <div key={idx} className="flex items-center py-5 border-b border-gray-100 last:border-0">
                             <div className="w-5 h-5 bg-[#E45454] rounded-full relative mr-4 flex-shrink-0">
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-[2px] bg-white rounded-sm"></div>
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-[2px] bg-white rounded-sm"></div>
                             </div>
                             <span className="text-gray-800 text-[17px] font-medium">{getDiseaseName(disease.key)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-5 text-gray-500 text-[17px]">Không có bệnh lý nào được lưu.</div>
                    )
                  )}
                </div>
              </section>

              {isEditing && (
                <div className="pt-4 pb-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full md:w-auto px-10 py-4 bg-[#139B4B] hover:bg-[#108A42] text-white font-bold text-[17px] rounded-[16px] transition-all shadow-[0_4px_14px_0_rgba(19,155,75,0.39)] disabled:opacity-70"
                  >
                    {saving ? "Đang xử lý..." : "Lưu thay đổi"}
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
