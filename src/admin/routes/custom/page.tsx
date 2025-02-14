import { defineRouteConfig, RouteConfig } from "@medusajs/admin-sdk";
import { UsersSolid } from "@medusajs/icons";
import { Container, Heading, Text } from "@medusajs/ui";

const VendorsPage = () => {
  return (
    <Container className="p-4">
      <Heading level="h1">Vendors</Heading>
      <Text>Manage your vendors from here.</Text>
    </Container>
  );
};

export const config: RouteConfig = defineRouteConfig({
  label: "Vendors", // Sidebar Label
  icon: UsersSolid, // Sidebar Icon
});

export default VendorsPage;
