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
            for (let i = 0; i < this.sightings.length; i++) {
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
                self.sightings.push({
                    id: r.data.id,
                    name: self.new_product_name,
                    purchased: false,
                });
                self.new_product_name = "";
            });
            // This happens right after time 1, before time 2. 
            console.log("I am a happy coder"); 
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

