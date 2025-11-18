//Import các router ở đây
import routerUser from "./userRoutes.js";
import { notFound, handleError } from "./error.js";
import routerBook from "./bookRoutes.js";

const router = (app) => {

    app.use('/api/users', routerUser);
    app.use('/api/books', routerBook);
    app.get('/', (req, res)=>{
        res.send("API is Working");
    })

    
    //Lưu ý: Không được để router khác trên 2 middleware này
    //lỗi không tìm thấy API
    app.use(notFound);
    //xử lý lỗi chung khi ứng dụng trả về lỗi
    app.use(handleError);
};

export default router;