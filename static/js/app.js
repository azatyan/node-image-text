jQuery(function($){
    $('input').iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass: 'iradio_minimal-red'
    });
    $("#create").click(function(event){
        if($("textarea").val()==''){
            return alert('Fill the text please!')
        } else {
            $("#coverDownload").modal('show');
            var val ="/?color="+$("select").val()+"&text="+$("textarea").val()+"&image="+$("input[name=image]:checked").val();
            $("#image").attr("src",val);
            $("#link").attr("href",val);

        }
    })
});