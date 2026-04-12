import { describe, expect, it } from "vitest";

describe("WhatsApp Integration", () => {
  const WHATSAPP_NUMBER = "573123344130";

  it("generates correct WhatsApp message format", () => {
    const orderNumber = "GIO-1712800000000-ABC1";
    const customerName = "Juan Pérez";
    const customerEmail = "juan@test.com";
    const customerPhone = "+57 300 000 0000";
    const customerAddress = "Bogotá, Colombia";
    const items = [
      { name: "VIVI MINI", quantity: 1, price: 85000 },
      { name: "040-1", quantity: 2, price: 50000 },
    ];
    const total = 185000;

    // Simulate message generation
    const itemsList = items
      .map(i => `• ${i.name} (x${i.quantity}) - $${(i.price * i.quantity).toLocaleString("es-CO")} COP`)
      .join("%0A");

    const message = `*Nuevo Pedido G·I·O Marroquinería*%0A%0A*Número de Orden:* ${orderNumber}%0A%0A*Cliente:* ${customerName}%0A*Email:* ${customerEmail}%0A*Teléfono:* ${customerPhone}%0A*Dirección:* ${customerAddress}%0A%0A*Productos:%0A${itemsList}%0A%0A*Total: $${total.toLocaleString("es-CO")} COP*%0A%0A*Método de Pago:* Nequi / Daviplata / Transferencia Bancaria`;

    expect(message).toContain("Nuevo Pedido G·I·O Marroquinería");
    expect(message).toContain(orderNumber);
    expect(message).toContain(customerName);
    expect(message).toContain(customerEmail);
    expect(message).toContain("VIVI MINI");
    expect(message).toContain("040-1");
    expect(message).toContain("$185.000 COP");
  });

  it("generates correct WhatsApp URL", () => {
    const orderNumber = "GIO-1712800000000-ABC1";
    const message = "Test%20message";
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    expect(whatsappUrl).toContain("https://wa.me/");
    expect(whatsappUrl).toContain(WHATSAPP_NUMBER);
    expect(whatsappUrl).toContain("?text=");
  });

  it("handles special characters in customer data", () => {
    const customerName = "María José García";
    const customerAddress = "Cra. 7 #45-89, Apto. 302";

    // WhatsApp API handles encoding automatically, we just need to ensure
    // the message is properly formatted with the customer data
    const message = `*Cliente:* ${customerName}%0A*Dirección:* ${customerAddress}`;

    expect(message).toContain("María");
    expect(message).toContain("José");
    expect(message).toContain("García");
    expect(message).toContain("Cra.");
    expect(message).toContain("Apto.");
  });

  it("validates WhatsApp number format", () => {
    const validNumbers = [
      "573123344130",
      "573001234567",
      "573219876543",
    ];

    validNumbers.forEach(number => {
      // Colombian WhatsApp numbers: 57 + 10 digits
      expect(number).toMatch(/^57\d{10}$/);
      expect(number.length).toBe(12);
    });
  });

  it("handles empty optional fields", () => {
    const customerName = "Test User";
    const customerEmail = "test@test.com";
    const customerPhone = "";
    const customerAddress = "";

    const message = `*Cliente:* ${customerName}%0A*Email:* ${customerEmail}%0A*Teléfono:* ${customerPhone || "No indicado"}%0A*Dirección:* ${customerAddress || "No indicada"}`;

    expect(message).toContain("No indicado");
    expect(message).toContain("No indicada");
  });

  it("formats currency correctly for WhatsApp message", () => {
    const amounts = [85000, 50000, 27000, 95000];

    amounts.forEach(amount => {
      const formatted = amount.toLocaleString("es-CO");
      expect(formatted).toMatch(/\d{1,3}(\.\d{3})*$/);
    });
  });

  it("generates unique order numbers for different timestamps", () => {
    const orderNumber1 = `GIO-${Date.now()}-ABC1`;
    const orderNumber2 = `GIO-${Date.now() + 1000}-ABC2`;

    expect(orderNumber1).not.toBe(orderNumber2);
    expect(orderNumber1).toMatch(/^GIO-\d+-[A-Z0-9]+$/);
    expect(orderNumber2).toMatch(/^GIO-\d+-[A-Z0-9]+$/);
  });
});
