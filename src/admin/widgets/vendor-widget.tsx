import { defineWidgetConfig, WidgetConfig  } from "@medusajs/admin-sdk";
import { Container, Heading, Text } from "@medusajs/ui";

const VendorWidget = () => {
  return (
    <Container className="p-4">
      <Heading level="h2">Vendor Management</Heading>
      <Text>This is a custom widget for managing vendors.</Text>
    </Container>
  );
};

// Register the widget in Inventory Vendors and Vendors Section
export const config: WidgetConfig = defineWidgetConfig({
    zone: ["inventory_item.list.after"],
  });

export default VendorWidget;
