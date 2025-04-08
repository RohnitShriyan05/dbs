// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Building,
  User,
  BookOpen,
  Calendar,
  Award,
  Link2,
} from "lucide-react";

interface UserData {
  name?: string;
  email?: string;
  userType?: "student" | "professor";
  collegeName?: string;
  graduationYear?: number;
  cgpa?: number;
  position?: string;
  googleScholar?: string;
  otherLinks?: string[];
  interests?: string[];
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  isLink?: boolean;
  capitalize?: boolean;
}

const InfoItem = ({
  icon,
  label,
  value,
  isLink,
  capitalize,
}: InfoItemProps) => (
  <div className="flex items-start space-x-3">
    <span className="text-green-500 mt-1">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {isLink && value ? (
        <a
          href={value.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className={`text-gray-900 ${capitalize ? "capitalize" : ""}`}>
          {value || "N/A"}
        </p>
      )}
    </div>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Update the fetchUser function in useEffect
    // app/profile/page.tsx (updated fetchUser function)
    // In your profile/page.tsx
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        const response = await fetch("/api/users/me", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        console.log("Response status:", response.status);

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text.slice(0, 100));
          throw new Error(`Invalid response: ${text.slice(0, 100)}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
          console.error("Error in response:", data.error);
          throw new Error(data.error || "Failed to fetch user");
        }

        setUser(data.data);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError(err.message);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center p-4 max-w-md">
          {error} - Redirecting to login...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-green-500 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                  <User className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user?.name || "No Name"}
                </h1>
                <p className="text-green-100 flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  {user?.collegeName || "No college specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-500 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={<Mail className="h-5 w-5" />}
                  label="Email"
                  value={user?.email}
                />
                <InfoItem
                  icon={<GraduationCap className="h-5 w-5" />}
                  label="Role"
                  value={user?.userType}
                  capitalize
                />
              </div>
            </div>

            {/* Conditional Sections */}
            {user?.userType === "student" ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-green-500 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Academic Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Calendar className="h-5 w-5" />}
                    label="Graduation Year"
                    value={user?.graduationYear}
                  />
                  <InfoItem
                    icon={<Award className="h-5 w-5" />}
                    label="CGPA"
                    value={user?.cgpa?.toFixed(2)}
                  />
                </div>
              </div>
            ) : (
              user?.userType === "professor" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-green-500 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Professional Details
                  </h2>
                  <div className="space-y-4">
                    <InfoItem
                      icon={<User className="h-5 w-5" />}
                      label="Position"
                      value={user?.position}
                    />
                    <InfoItem
                      icon={<Link2 className="h-5 w-5" />}
                      label="Google Scholar"
                      value={user?.googleScholar}
                      isLink
                    />
                    {user?.otherLinks?.map((link, index) => (
                      <InfoItem
                        key={index}
                        icon={<Link2 className="h-5 w-5" />}
                        label={`Link ${index + 1}`}
                        value={link}
                        isLink
                      />
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Interests Section */}
            {user?.interests && user.interests.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-green-500 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
