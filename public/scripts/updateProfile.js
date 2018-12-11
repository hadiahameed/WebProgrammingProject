$("#submitUpdate").click(async function () {
   var firstname = $("input[name='firstname']").val()
   var lastname = $("input[name='lastname']").val()
   var username = $("input[name='username']").val();
   var password = $("input[name='password']").val();
   console.log("Inside script")
   console.log(password)
   let res = await axios.patch(`/profileEdit/${username}`, {
        firstname : firstname,
        lastname : lastname,
        username:username,
        password:password
    });
    $.alert(res.data.msg);
})
