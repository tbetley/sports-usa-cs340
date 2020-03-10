<%- include('partials/header.ejs'); %>

    <h3>Update An Item</h3>
    <div class="container">
        <form action="/updateItem" method="post">
            <div class="form-group">
                <label for="vendorID">Vendor</label>
                <input type="text" class="form-control" id="vendorID" name="vendor">
            </div>
            <div class="form-group">
                <label for="itemName">Item Name</label>
                <input type="text" class="form-control" id="itemName" name="itemName">
            </div>
            <div class="form-group">
                <label for="price">Price</label>
                <input type="text" class="form-control" id="price" name="price">
            </div>
            <div class="form-group">
                <label for="quantity">Quantity</label>
                <input type="number" class="form-control" id="quantity" name="quantity">
            </div>
            <div class="form-group">
                <label for="type">Type</label>
                <input type="text" class="form-control" id="type" name="type">
            </div>
            <div class="form-group">
                <label for="sport">Sport</label>
                <input type="text" class="form-control" id="sport" name="sport">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>

<%- include('partials/footer.ejs'); %>