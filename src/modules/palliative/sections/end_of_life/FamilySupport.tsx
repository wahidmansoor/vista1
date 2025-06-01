import React from "react";
import { usePalliativeCare } from "../../context/PalliativeContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Plus, UserPlus } from "lucide-react";
import type { FamilyMember } from "../../context/PalliativeContext";

// Support needs categories
const supportNeeds = [
  "Emotional Support",
  "Practical Help",
  "Information/Education",
  "Respite Care",
  "Bereavement Support",
  "Financial Guidance"
] as const;

const FamilySupport = () => {
  const { state, addFamilyMember, updateFamilyMember } = usePalliativeCare();
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [formData, setFormData] = React.useState<Omit<FamilyMember, "id" | "needsSupport">>({
    name: "",
    relationship: "",
    isMainCaregiver: false,
    contactInfo: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      ...formData,
      needsSupport: Array(supportNeeds.length).fill(false)
    };
    addFamilyMember(newMember);
    setFormData({
      name: "",
      relationship: "",
      isMainCaregiver: false,
      contactInfo: "",
    });
    setShowAddForm(false);
  };

  const updateNeedStatus = (memberId: string, needIndex: number, checked: boolean) => {
    const member = state.familyMembers.find(m => m.id === memberId);
    if (!member) return;

    const updatedNeeds = [...member.needsSupport];
    updatedNeeds[needIndex] = checked;

    updateFamilyMember(memberId, {
      needsSupport: updatedNeeds
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Family Support Network</h2>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => handleInputChange("relationship", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isMainCaregiver"
                  checked={formData.isMainCaregiver}
                  onCheckedChange={(checked) => 
                    handleInputChange("isMainCaregiver", checked as boolean)
                  }
                />
                <Label htmlFor="isMainCaregiver">Primary Caregiver</Label>
              </div>
              <Button type="submit" className="w-full">Add Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {state.familyMembers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No family members added yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Click "Add Family Member" to start building the support network.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {state.familyMembers.map((member) => (
            <Card key={member.id} className={member.isMainCaregiver ? "border-l-4 border-l-blue-500" : ""}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{member.name}</span>
                  {member.isMainCaregiver && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Primary Caregiver
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-medium">{member.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{member.contactInfo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Support Needs</p>
                    <div className="space-y-2">
                      {supportNeeds.map((need, index) => (
                        <div key={need} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${member.id}-${need}`}
                            checked={member.needsSupport[index]}
                            onCheckedChange={(checked) => 
                              updateNeedStatus(member.id, index, checked as boolean)
                            }
                          />
                          <Label htmlFor={`${member.id}-${need}`}>{need}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {state.familyMembers.some(member => member.needsSupport.includes(true)) && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">Support Needs Identified</h4>
                <p className="text-sm text-amber-700 mt-1">
                  One or more family members require support. Consider referral to social work or support services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FamilySupport;
