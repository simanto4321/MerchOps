import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.deliveryConnection.deleteMany();
  await prisma.inboxMessage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.adSpend.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.appSetting.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Ayesha Rahman",
      email: "admin@merchops.local",
      role: "ADMIN",
    },
  });
  const staff = await prisma.user.create({
    data: {
      name: "Manik Hasan",
      email: "staff@merchops.local",
      role: "STAFF",
    },
  });
  await prisma.user.create({
    data: {
      name: "Guest Viewer",
      email: "guest@merchops.local",
      role: "GUEST",
    },
  });

  const products = await Promise.all([
    prisma.product.create({
      data: {
        sku: "TEE-BLK-M",
        name: "Classic Black Tee — M",
        costPrice: 280,
        retailPrice: 650,
        factoryCost: 190,
        stockQuantity: 120,
        lowStockThreshold: 25,
      },
    }),
    prisma.product.create({
      data: {
        sku: "TEE-WHT-L",
        name: "Everyday White Tee — L",
        costPrice: 270,
        retailPrice: 620,
        factoryCost: 185,
        stockQuantity: 8,
        lowStockThreshold: 20,
      },
    }),
    prisma.product.create({
      data: {
        sku: "HOOD-NAV-XL",
        name: "Navy Oversized Hoodie — XL",
        costPrice: 780,
        retailPrice: 1650,
        factoryCost: 520,
        stockQuantity: 45,
        lowStockThreshold: 10,
      },
    }),
    prisma.product.create({
      data: {
        sku: "CAP-LOGO",
        name: "Logo Cap",
        costPrice: 150,
        retailPrice: 450,
        factoryCost: 95,
        stockQuantity: 200,
        lowStockThreshold: 30,
      },
    }),
  ]);

  const [teeBlack, teeWhite, hoodie, cap] = products;

  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-1001",
      customerName: "Rafi Islam",
      customerPhone: "01711000001",
      sourceChannel: "WHATSAPP",
      totalAmount: 1950,
      parcelValue: 1950,
      deliveryStatus: "PENDING",
      tags: JSON.stringify(["vip", "dhaka"]),
      createdById: staff.id,
      items: {
        create: [
          {
            productId: teeBlack.id,
            orderedQuantity: 2,
            acceptedQuantity: 0,
            unitPrice: 650,
          },
          {
            productId: cap.id,
            orderedQuantity: 1,
            acceptedQuantity: 0,
            unitPrice: 450,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-1002",
      customerName: "Nusrat Jahan",
      customerPhone: "01822000002",
      sourceChannel: "INSTAGRAM",
      totalAmount: 3100,
      parcelValue: 3100,
      deliveryStatus: "FAILED",
      reasonCode: "Customer didn't pick up",
      adminComments: "Manik today's phone unreachable — retry AM",
      tags: JSON.stringify(["follow-up"]),
      createdById: staff.id,
      items: {
        create: [
          {
            productId: hoodie.id,
            orderedQuantity: 1,
            acceptedQuantity: 0,
            unitPrice: 1650,
          },
          {
            productId: teeWhite.id,
            orderedQuantity: 2,
            acceptedQuantity: 0,
            unitPrice: 620,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-1003",
      customerName: "Karim Uddin",
      customerPhone: "01933000003",
      sourceChannel: "FACEBOOK",
      totalAmount: 3250,
      parcelValue: 1950,
      deliveryStatus: "PARTIAL",
      reasonCode: "Partial accept",
      adminComments: "Kept 3 of 5 tees; 2 returned to stock",
      createdById: staff.id,
      items: {
        create: [
          {
            productId: teeBlack.id,
            orderedQuantity: 5,
            acceptedQuantity: 3,
            returnedQuantity: 2,
            unitPrice: 650,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-1004",
      customerName: "Sadia Khan",
      customerPhone: "01644000004",
      sourceChannel: "TIKTOK",
      totalAmount: 1650,
      parcelValue: 1650,
      deliveryStatus: "DELIVERED",
      createdById: admin.id,
      items: {
        create: [
          {
            productId: hoodie.id,
            orderedQuantity: 1,
            acceptedQuantity: 1,
            unitPrice: 1650,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-1005",
      customerName: "Imran Hossain",
      customerPhone: "01555000005",
      sourceChannel: "WHATSAPP",
      totalAmount: 900,
      parcelValue: 900,
      deliveryStatus: "IN_PROGRESS",
      tags: JSON.stringify(["same-day"]),
      createdById: staff.id,
      items: {
        create: [
          {
            productId: cap.id,
            orderedQuantity: 2,
            acceptedQuantity: 0,
            unitPrice: 450,
          },
        ],
      },
    },
  });

  await prisma.adSpend.createMany({
    data: [
      {
        campaignName: "IG Boost — Black Tee",
        productId: teeBlack.id,
        amount: 5000,
        notes: "Meta boost week 1",
      },
      {
        campaignName: "TikTok Spark — White Tee",
        productId: teeWhite.id,
        amount: 3200,
        notes: "Running at thin margin — watch closely",
      },
      {
        campaignName: "FB Reach — Hoodie",
        productId: hoodie.id,
        amount: 1500,
      },
    ],
  });

  await prisma.inboxMessage.createMany({
    data: [
      {
        channel: "INSTAGRAM",
        customerName: "Farhana",
        customerPhone: "01766000006",
        body: "Hi, do you have the black tee in M? Can COD to Mirpur?",
        status: "OPEN",
        tags: JSON.stringify(["inquiry"]),
      },
      {
        channel: "WHATSAPP",
        customerName: "Rafi Islam",
        customerPhone: "01711000001",
        body: "Please confirm parcel for ORD-1001 — need by Friday",
        status: "LINKED",
        orderId: order1.id,
        tags: JSON.stringify(["order"]),
      },
      {
        channel: "FACEBOOK",
        customerName: "Tanim",
        body: "Want to exchange hoodie size XL → L",
        status: "OPEN",
        tags: JSON.stringify(["exchange"]),
      },
    ],
  });

  await prisma.deliveryConnection.createMany({
    data: [
      {
        provider: "PATHAO",
        displayName: "Pathao Parcel",
        apiBaseUrl: "https://api-hermes.pathao.com",
        status: "DISCONNECTED",
      },
      {
        provider: "STEADFAST",
        displayName: "Steadfast",
        apiBaseUrl: "https://portal.packzy.com/api/v1",
        status: "DISCONNECTED",
      },
      {
        provider: "REDX",
        displayName: "RedX",
        apiBaseUrl: "https://openapi.redx.com.bd",
        status: "DISCONNECTED",
      },
      {
        provider: "SUNDARBAN",
        displayName: "Sundarban Courier",
        apiBaseUrl: "https://api.sundarbancourier.com",
        status: "DISCONNECTED",
      },
      {
        provider: "PAPERFLY",
        displayName: "Paperfly",
        apiBaseUrl: "https://api.paperfly.com.bd",
        status: "DISCONNECTED",
      },
      {
        provider: "ECOURIER",
        displayName: "eCourier",
        apiBaseUrl: "https://backoffice.ecourier.com.bd/api",
        status: "DISCONNECTED",
      },
    ],
  });

  await prisma.appSetting.createMany({
    data: [
      { key: "telegram_bot_token", value: "" },
      { key: "telegram_chat_id", value: "" },
      {
        key: "telegram_notify_on",
        value: JSON.stringify(["NEW_ORDER", "FAILED_DELIVERY", "LOW_STOCK"]),
      },
    ],
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "LOGIN",
      entityType: "User",
      entityId: admin.id,
      newValue: JSON.stringify({ role: "ADMIN" }),
    },
  });

  console.log("Seeded MerchOps demo data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
