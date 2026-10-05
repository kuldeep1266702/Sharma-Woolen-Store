# Wool & Warmth — Hand-Stitched Store

A mobile-friendly storefront for handmade woollen baby kits, caps, socks, gloves and sweaters.

## Included
- Product catalogue with category filters
- Shopping cart with quantity controls
- COD checkout form
- Customer name, phone, address, city and PIN
- Order ID generation
- Order saved in browser localStorage
- Success popup after order creation
- WhatsApp message pre-filled with order + address details
- Uses the supplied pink baby-kit photo as the main product image
- Responsive mobile design

## Important: set the seller WhatsApp number
Open `script.js` and replace:

`const SELLER_WHATSAPP = "91XXXXXXXXXX";`

with the seller's WhatsApp number, international format, without `+`, spaces or dashes.
Example: `919876543210`

## WhatsApp limitation
A normal website can open WhatsApp with a pre-filled message, but it cannot silently press Send on the seller's behalf. The customer will see the WhatsApp chat and can tap Send.

## Real-time production version
This package is the front-end version. For true real-time inventory, order status, seller dashboard and automatic order notifications, connect the same UI to Firebase/Supabase (or a small Node/PHP backend) and store products/orders in a database.

## Run
You can open `index.html` directly in a browser. For best results, serve the folder with a simple local web server.
