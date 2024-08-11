exports.handler = async (event) => {
  try {
    const order = JSON.parse(event.body);
    const inventory = {
      burger: 50,
      fries: 100,
      soda: 200,
    };

    const items = order.items;
    let isAvailable = true;

    for (const item of items) {
      if (inventory[item.product] < item.quantity) {
        isAvailable = false;
        break;
      }
    }

    if (isAvailable) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Inventory available",
          orderId: order.orderId,
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Insufficient inventory",
          orderId: order.orderId,
        }),
      };
    }
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON" }),
    };
  }
};
