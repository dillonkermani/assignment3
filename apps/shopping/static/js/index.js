"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {
    data: function() {
        return {
            products: [],
            new_product_name: "",
        };
    },
    methods: {
        find_product_idx: function(name) {
            // Finds the index of an item in the list.
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].name === name) {
                    return i;
                }
            }
            return null;
        },
        add_product: function() {
            // This is time 1, the time of the button click.
            let self = this; 
            axios.post(add_product_url, {
                name: self.new_product_name,
                purchased: false,
            }).then(function (r) {
                // This is time 2, much later, when the server answer comes back. 
                console.log("Got the id: " + r.data.id);
                self.products.unshift({
                    id: r.data.id,
                    name: self.new_product_name,
                    purchased: false,
                });
                self.new_product_name = "";
            });
            // This happens right after time 1, before time 2. 
            console.log("I am a happy coder"); 
        },
        delete_product: function(name) {
            let self = this;
            let idx = self.find_product_idx(name); // Find the index of the product by name
            if (idx === null) {
                console.log("Product not found: " + name);
                return;
            }
            let product_id = self.products[idx].id; // Get the product's id
            axios.post(delete_product_url, {
                id: product_id, // Use the product's id here
            }).then(function (r) {
                self.products.splice(idx, 1); // Removes the product from sight.
                console.log("Deleted product " + name);
                console.log("Updated products: " + self.products);
            });
        },
        toggle_purchase: function(name) {
            let self = this;
            let idx = self.find_product_idx(name);
            if (idx === null) {
                console.log("Product not found: " + name);
                return;
            }
            let product_id = self.products[idx].id;
            let currentStatus = self.products[idx].purchased;
            axios.post(toggle_purchase_url, {
                id: product_id,
                status: currentStatus,
            }).then(function (r) {
                let purchasedProduct = { ...self.products[idx], purchased: currentStatus }; // Create a new object
                self.products.splice(idx, 1); // Remove the product from its current position
                if (currentStatus == false) {
                    self.products.unshift(purchasedProduct); // Add the product at the beginning of the array
                } else {
                    self.products.push(purchasedProduct); // Add the product back at the end of the array
                }
                console.log("Toggled purchase status for product " + name);
            });
        },

    },
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
    axios.get(load_products_url).then(function (r) {
        console.log(r.status);
        app.vue.products = r.data.products;
    });
}

// This is the initial data load.
app.load_data();

