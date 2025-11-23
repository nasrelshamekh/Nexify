import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

// Using your uploaded logo color for accent (#1D4ED8 as an example blue from the logo)
const accentColor = "#1D4ED8";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main content */}
      <div className="grow flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-white shadow-lg rounded-xl border-8" style={{ borderColor: accentColor }}>
          <CardBody className="flex flex-col items-center text-center p-8">
            <h1
              className="text-6xl font-bold mb-4"
              style={{ color: accentColor }}
            >
              404
            </h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-gray-500 mb-6">
              Sorry, the page you are looking for does not exist or has been
              moved.
            </p>
            <Button
              color="primary"
              style={{ backgroundColor: accentColor }}
              onClick={() => navigate("/")}
              className="px-6 py-2"
            >
              Go Home
            </Button>
          </CardBody>
        </Card>
      </div>


    </div>
  );
}
