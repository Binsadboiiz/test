export default function HandleErrorAPI(error, naviagate, from="") {
    if(error instanceof Response) {
        naviagate('/error', {
            state: {
                error: {
                    message: `The Server returned an error: ${error.status} - ${error.statusText}`,
                    status: error.status,
                    from,
                }
            }
        })
        return;
    }

    //lỗi mà mình tự throw
    if(error && typeof error === "object" && "message" in error) {
        naviagate('/error', {
            state: {
                error: {
                    message: error.message,
                    status: error.status || null,
                    from,
                }
            }
        })
        return;
    }


    // lỗi network, fetch,....bla bla
    naviagate('/error', {
        state: {
            error: {
                message: error?.message === "Failed to fetch"
                ? "Không kêt nối được server. Kiểm tra lại internet của m đi" 
                : (error?.message || "Lỗi không xác định"),
                status: null,
                from,
            }
        }
    });
}