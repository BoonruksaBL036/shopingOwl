/**
 * ประกาศตัวแปร cart เป็น Object ว่างใช้เก็บข้อมูลสินค้าในรถเข็นเริ่มต้น
 */
const cart = {}; // รถเข็นสินค้า
let currentProductId = null;
let currentProductPrice = 0;

const toppingPrices = {
  "บุกขาว": 10,
  "ซอสบราวน์ชูการ์": 15,
  "ลาวาเนื้อมันม่วง": 15,
  "ชีส": 20,
  "ไข่มุก": 5,
  "คริสตัสใส": 10,
  "เจลลี่ผลไม้": 5
};
/**
 * ใช้ querySelectorAll เลือกทุก element ที่อยู่ class ของ add-to-cart และใช้ forEach loop เพื่อเพิ่ม even ที่จะทำงานเมื่อมีการคลิกปุ่ม Add to Cart ในหน้า website
 */
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    const price = parseFloat(button.getAttribute("data-price"));

    // เพิ่มสินค้าไปยังรถเข็น
    if (!cart[productId]) {
      cart[productId] = { quantity: 1, price: price, toppings: [], toppingPrice: 0 };
    } else {
      cart[productId].quantity++;
    }

    // แสดงป๊อปอัพให้เลือกท็อปปิ้ง
    const toppingOptionsHTML = Object.keys(toppingPrices).map(topping => {
      return `<label><input type="checkbox" class="topping-option" value="${topping}"> ${topping}</label><br>`;
    }).join('');
    document.getElementById("toppingOptions").innerHTML = toppingOptionsHTML;

    // เปิด Modal ให้เลือกท็อปปิ้ง
    $('#toppingModal').modal('show');

    // เมื่อกดยืนยันการเลือกท็อปปิ้ง
    document.getElementById("confirmToppings").addEventListener("click", () => {
      const selectedToppings = [];
      document.querySelectorAll(".topping-option:checked").forEach(checkbox => {
        selectedToppings.push(checkbox.value);
      });

      // คำนวณราคาท็อปปิ้ง
      const toppingPrice = selectedToppings.reduce((total, topping) => {
        return total + toppingPrices[topping];
      }, 0);

      // อัปเดตข้อมูลท็อปปิ้งในรถเข็น
      cart[productId].toppings = selectedToppings;
      cart[productId].toppingPrice = toppingPrice;

      updateCartDisplay();  // อัปเดตแสดงผลในรถเข็น
      $('#toppingModal').modal('hide');  // ปิด Modal
    });
  });
});



/**ฟังก์ชันนี้มีหน้าที่ในการอัปเดตและแสดงผลของรถเข็นในหน้าเว็บให้เป็นตรงกับข้อมูลในตัวแปล Cart={} โดยผู้ใช้จะสามารถเห็นสถานะปัจจุบันของรถเข็นได้ และเพิ่มปุ่มเพื่อลบสินค้าออกได้ จะมีปุ่มลบสินค้าแต่ละชิ้นที่อยู่ในตารางของรถเข็น */
function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = "";

  let totalPrice = 0;

  // Create a table
  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Product", "Topping", "Topping Price", "Quantity","Price", "Total", "Actions"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    const toppingTotalPrice = item.toppingPrice * item.quantity; // คำนวณราคาท็อปปิ้ง
    totalPrice += itemTotalPrice + toppingTotalPrice; // รวมราคา

    const tr = document.createElement("tr");

    const productNameCell = document.createElement("td");
    productNameCell.textContent = `${productId}`;
    tr.appendChild(productNameCell);

    // แสดงท็อปปิ้งที่เลือก
    const toppingCell = document.createElement("td");
    toppingCell.textContent = item.toppings.length > 0 ? item.toppings.join(", ") : "ไม่มี";
    tr.appendChild(toppingCell);

    const toppingPriceCell = document.createElement("td");
    toppingPriceCell.textContent = `$${toppingTotalPrice}`; // แสดงราคาท็อปปิ้ง
    tr.appendChild(toppingPriceCell);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity;
    tr.appendChild(quantityCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `$${item.price}`;
    tr.appendChild(priceCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = `$${itemTotalPrice + toppingTotalPrice}`; // รวมราคา
    tr.appendChild(totalCell);

    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add("btn", "btn-danger", "delete-product");
    deleteButton.setAttribute("data-product-id", productId);
    deleteButton.addEventListener("click", () => {
      delete cart[productId];
      updateCartDisplay();
    });
    actionsCell.appendChild(deleteButton);
    tr.appendChild(actionsCell);

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);

  cartElement.appendChild(table);

  if (Object.keys(cart).length === 0) {
    cartElement.innerHTML = "<p>No items in cart.</p>";
  } else {
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total Price: $${totalPrice}`; // แสดงราคาทั้งหมด
    cartElement.appendChild(totalPriceElement);
  }
}
/** จะเพิ่ม event ให้กับ element ที่มี id printCart เมื่อมีการคลิก Print Cart Recipt บิลใบเสร็จของสินค้า. */
document.getElementById("printCart").addEventListener("click", () => {
  printReceipt("Thank you!", generateCartReceipt());
});

/**ฟังก์ชันนี้ใช้สำหรับพิมพ์บิลใบเสร็จของสินค้า จะเปิดหน้าต่างใหม่และพิมพ์บิลใบเสร็จของสินค้า.*/
function printReceipt(title, content) {
  const printWindow = window.open("1", "_blank");
  printWindow.document.write(
    `<html><head><title>${title}</title></head><body>${content}</body></html>`
  );
  printWindow.document.close();
  printWindow.print();
}

/** ฟังก์ชันนี้ใช้สำหรับสร้างเนื้อหาในใบเสร็จของ Cart.*/
function generateCartReceipt() {
  let receiptContent = "<h2>Cart Receipt</h2>";

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;

    receiptContent += `<p>Product ${productId}: ${item.quantity} x $${item.price} = $${itemTotalPrice}</p>`;
  }

  const totalPrice = Object.keys(cart).length > 0 ? calculateTotalPrice() : 0;
  receiptContent += `<p>Total Price: $${totalPrice}</p>`;

  return receiptContent;
}

/**
 * สร้างบิลใบเสร็จของสินค้า และปริ้นออกเป็น PDF
 */
function generateProductReceipts() {
  let receiptContent = "<h2>Product Receipts</h2>";

  document.querySelectorAll(".product").forEach((product, index) => {
    const productName = product.querySelector("h5").textContent;
    const productPrice = parseFloat(
      product.querySelector(".add-to-cart").getAttribute("data-price")
    );

    receiptContent += `<p>${productName} - $${productPrice}</p>`;
  });

  return receiptContent;
}

/** ฟังก์ชันนี้ใช้สำหรับคำนวณราคารวมของสินค้า Cart ตอน Print Cart Reciept*/
function generateCartReceipt() {
  let receiptContent = `
      <style>
        @page {
          size: 100mm 100mm;
        }
        body {
          width: 100mm;
          height: 100mm;
          margin: 0;
          padding: 1px;
          font-family: Arial, sans-serif;
        }
        h2 {
          text-align: center;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 5px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
      <p>SANGKONG SHOP!</p>
      <h2>Cart Receipt</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Topping</th>
            <th>ToppingPrice</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>`;

  let totalPrice = 0;

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    const toppingTotalPrice = item.toppingPrice * item.quantity; // คำนวณราคาท็อปปิ้ง

    receiptContent += `
    <tr>
      <td>${productId}</td>
      <td>${item.toppings.length > 0 ? item.toppings.join(", ") : "ไม่มี"}</td>
      <td>$${toppingTotalPrice}</td>
      <td>${item.quantity}</td>
      <td>$${item.price}</td>
      <td>$${itemTotalPrice + toppingTotalPrice}</td> <!-- รวมราคา -->
    </tr>`;

    totalPrice += itemTotalPrice + toppingTotalPrice; // รวมราคา
  }

  receiptContent += `
        </tbody>
      </table>
      <p>Total Price: $${totalPrice}</p>
      <p>คุณ Kays Tel.088-888-8888</p>
      `;

  return receiptContent;
}


// ++++++++++++++++++++++++++++
