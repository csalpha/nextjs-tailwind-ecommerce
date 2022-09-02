1.  Create Next App

    1. npx create-next-app nextjs-tailwind-ecommerce
    2. cd nextjs-tailwind-ecommerce
    3. npm run dev

2.  Install Tailwind (CSS Framework)

    1. npm install -D tailwindcss postcss autoprefixer
    2. npx tailwindcss init -p

3.  Create App Layout

    1. create components folder
    2. create Layout.jsx
    3. update header
    4. update main section
    5. update footer
    6. add tailwind classes

4.  List Products

    1. create data.js
    2. create images folder
    3. add images
    4. create ProductItem.jsx
    5. render products
    6. use apply modifier from tailwind

5.  Product Details

    1. create product folder
    2. create [slug].jsx ( ProductScreen )
    3. create 3 columns
    4. show image in first column
    5. show product info in second column
    6. show add to cart action on third column
    7. add styles
    8. npm i -D @types/react

6.  Handle Add To Cart

    1. create Store.jsx
    2. define react context
    3. define cart items state
    4. create add to cart action
    5. add reducer
    6. create store provider
    7. handle add to cart button

7.  Create Shopping Cart Page

    1.  create cart.jsx
    2.  get cart items from use context
    3.  list items in cart items
    4.  remove Item handler
    5.  redirect to cart screen after add to cart
    6.  add select box for quantity
    7.  handle select box change

8.  Save Cart Items in cookies

    1. npm install js-cookie
    2. save and retreive cart items in cookies

9.  Create Login Page

    1. npm install react-hook-form (simple form validation)
    2. input boxes
    3. login button
    4. sign in link
    5. add css classes for input boxes using tailwind
    6. implement form validation

10. Connect To MongoDB

    1. npm install mongoose
    2. install mongodb or use mongodb atlas
    3. save connection url in .env file
    4. create db.js
    5. create seed.js
    6. create user model User.js
    7. npm install bcrypt.js

11. Implement Login API

    1. npm i next-auth
    2. create nextauth.js
    3. implement sign
    4. use signin in login form

12. Create User Menu

    1. npm install @headlessui/react
    2. Create DropdownLink.jsx
    3. In the Layout.jsx implement logout handler
    4. add menu for user
    5. In the globals.css create new class
    6. In the Store.jsx we added a case for card reset

13. Implement Shipping Screen

    1. create shipping.jsx
    2. create CheckoutWizard.js
    3. get the shipping address from the user
    4. implement SAVE_SHIPPING_ADDRESS action in Store.jsx
    5. implement Auth function in app.js
    6. create unauthorized.jsx to redirect user to this page if user is not logged in
    7. redirect user to the payment screen

14. Implement Payment Method Screen to get the payment method from the user

    1. create payment method screen in payment.jsx (dispaly payment methods)
    2. add default button class in globals.css
    3. create a case for saving payment method in the Store.jsx (save payment method in context)

15. Seed products in /api/seed

    1. create a Product Model
    2. seed products to the Database

16. Load Products from Database instead of getting products from data.js

    1. fetch products from the MongoDb
    2. list products in the home screen
    3. list products in the details page
    4. when user click in add to cart, check the quantity of product
    5. show error message if product is out of stock

17. Create Place Order Screen

    1. in pages/placeorder.jsx we created a placeorder screeen
       to preview order and place order
    2. in payment.jsx we made the payment screen authenticated
    3. in pages/api/orders/index.js we created an api to create an order
    4. in the models/Order.js, we create a model to save order information
    5. in Store.jsx, we implement action 'CART_CLEAR_ITEMS'

18. Create Order Details Screen

    1. in pages/api/orders/[id].js, create an api to
       return the order information based on the order id
    2. in pages/order/[id].js, create a page to fetch order
       id from backend and show order information on the screen
    3. in styles/globals.css, we added to classes to show error message
       and successful message
