$("#fbtn").click(async function () {
    if (!$('form')[0].reportValidity()) {
        return false;
    }
    await postData("/blogs/new", getPostElements(postIds))
        .then(res => {
            if (res.ok) {
                location.href = "/blogs/manage?message=記事の作成が完了しました&status=0"
            } else {
                location.href = "/blogs/manage?message=記事の作成に失敗しました&status=1"
            }
        });
});
