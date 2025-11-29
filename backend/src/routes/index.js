//Import các router ở đây
import routerUser from "./userRoutes.js";
import { notFound, handleError } from "./error.js";
import routerBook from "./bookRoutes.js";
import routerForum from "./forumRoutes.js";
import routerAdmin from "./adminRouter.js";
import routerPublisher from "./publisherRouter.js";
import routerReview from "./reviewRouter.js";
import routerProfile from "./profileRoutes.js";
import routerComment from "./commentRouter.js";
const router = (app) => {

    app.use('/api/users', routerUser);
    app.use('/api/books', routerBook);
    app.use('/api/threads', routerForum);
    app.use('/api/admin', routerAdmin);
    app.use('/api/publishers', routerPublisher);
    app.use('/api/reviews', routerReview);
    app.use('/api/profile', routerProfile);
    app.use('/api/comments', routerComment);
    app.get('/', (req, res)=>{
        res.json("API is Working");
    })

    
    //Lưu ý: Không được để router khác trên 2 middleware này
    //lỗi không tìm thấy API
    app.use(notFound);
    //xử lý lỗi chung khi ứng dụng trả về lỗi
    app.use(handleError);
};

export default router;