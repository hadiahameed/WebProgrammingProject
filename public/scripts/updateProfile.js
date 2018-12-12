$("#submitUpdate").click(async function () {
   var firstname = $("input[name='firstname']").val()
   var lastname = $("input[name='lastname']").val()
   var username = $("input[name='username']").val();
   var password = $("input[name='password']").val();

   let result = $("#account-settings form").validate().form()
   event.preventDefault();
   if(result == false) {
       return
   }

   
   let res = await axios.patch(`/profileEdit/${username}`, {
        firstname : firstname,
        lastname : lastname,
        username:username,
        password:password
    });
    $.alert(res.data.msg);
})
