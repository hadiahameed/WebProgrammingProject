$("#submitUpdate").click(async function () {
   var firstname = $("input[name='firstname']").val()
   var lastname = $("input[name='lastname']").val()
   var username = $("input[name='username']").val();
   var password = $("input[name='password']").val();
   console.log(firstname);
   let res = await axios.patch('/profileEdit', {
        firstname : firstname,
        lastname : lastname,
        username:username,
        password:password
    });
    console.log(res);
    $.alert(res.data.msg);
})
