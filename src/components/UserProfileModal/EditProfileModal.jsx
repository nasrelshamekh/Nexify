import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Divider,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { FiBriefcase, FiGlobe, FiMapPin, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

export default function EditProfileModal({ isOpen, onOpenChange, initialData, onSave }) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setRole(initialData.role || "Frontend Developer");
            setLocation(initialData.location || "Alexandria, Egypt");
            setBio(initialData.bio || "Passionate Frontend Developer focused on creating clean, beautiful, and user-friendly web experiences.");
            setWebsite(initialData.website || "www.example.com");
        }
    }, [initialData, isOpen]);

    async function handleSave(onClose) {
        setIsSaving(true);
        try {
            const updated = {
                name: name.trim() || initialData?.name,
                role: role.trim() || "Frontend Developer",
                location: location.trim() || "Alexandria, Egypt",
                bio: bio.trim(),
                website: website.trim() || "www.example.com"
            };

            // Save to localStorage so custom edits persist locally
            localStorage.setItem(`nexify_profile_custom_${initialData?.email || 'default'}`, JSON.stringify(updated));

            if (onSave) {
                onSave(updated);
            }
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error) {
            console.error("Failed to save profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-center border-b border-gray-100">
                            <span className="text-xl font-bold text-gray-900">Edit Profile</span>
                            <span className="text-xs text-gray-500 font-normal">Update your public profile details</span>
                        </ModalHeader>
                        <ModalBody className="py-4 space-y-3">
                            <Input
                                label="Display Name"
                                placeholder="Enter your full name"
                                variant="bordered"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                startContent={<FiUser className="text-gray-400" />}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    label="Role / Title"
                                    placeholder="e.g. Frontend Developer"
                                    variant="bordered"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    startContent={<FiBriefcase className="text-gray-400" />}
                                />
                                <Input
                                    label="Location"
                                    placeholder="e.g. Alexandria, Egypt"
                                    variant="bordered"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    startContent={<FiMapPin className="text-gray-400" />}
                                />
                            </div>
                            <Input
                                label="Website"
                                placeholder="e.g. yourportfolio.com"
                                variant="bordered"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                startContent={<FiGlobe className="text-gray-400" />}
                            />
                            <Textarea
                                label="Bio / About Me"
                                placeholder="Write a short summary about yourself..."
                                variant="bordered"
                                minRows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </ModalBody>
                        <Divider />
                        <ModalFooter className="flex justify-end gap-2">
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button isLoading={isSaving} color="primary" onPress={() => handleSave(onClose)}>
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
