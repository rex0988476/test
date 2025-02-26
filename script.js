class Anime{
    constructor(id, name, img_link, total_score, types){
        this.id = id;
        this.name = name;
        this.img_link = img_link;
        this.total_score = total_score;
        this.types = types;
        this.info = [];
        this.title_row_colspan = 0;//this.info.length+2;
        this.type_row_colspan = 0;//this.info.length+1;
    }
    addInfo(year, watched, total, date_start, date_end, score){
        /*
        //season: 1~n, int, 第x季
        year: 西元年, int, 年份
        watched: 1~n, int, 看過的集數
        total: 1~n, int, 總集數
        date_start: "xx/xx", str, 開始播放日期
        date_end: "xx/xx", str, 結束播放日期
        score: 1.0~10, str, 評分
        */
        this.info.push({year: year, watched: watched, total: total, date_start: date_start, date_end: date_end, score: score});
    }
}
var ANIMES = [];

document.addEventListener("DOMContentLoaded", function () {
    const sortButtons = document.querySelectorAll(".sort-btn");
    const orderButtons = document.querySelectorAll(".order-btn");
    
    // 設定預設按鈕 (Sort Default & Order Ascending)
    document.querySelector(".sort-btn[data-sort='default']").classList.add("active");
    document.querySelector(".order-btn[data-order='ascending']").classList.add("active");

    // 讓 Sort 類別的按鈕，確保只有一個是 active
    sortButtons.forEach(button => {
        button.addEventListener("click", function () {
            sortButtons.forEach(btn => btn.classList.remove("active")); // 移除所有 active
            this.classList.add("active"); // 設定當前按鈕為 active
        });
    });

    // 讓 Order 類別的按鈕，確保只有一個是 active
    orderButtons.forEach(button => {
        button.addEventListener("click", function () {
            orderButtons.forEach(btn => btn.classList.remove("active")); // 移除所有 active
            this.classList.add("active"); // 設定當前按鈕為 active
        });
    });
});


// 升降序
document.querySelectorAll(".order-btn").forEach(button => {
    button.addEventListener("click", function () {
        const orderType = this.getAttribute("data-order");
        const container = document.getElementById("id_container");
        container.innerHTML = ""; // 清空容器
        let sortedData = [...ANIMES]; // 複製數據，避免修改原始數據
        // **取得當前 Sort 的按鈕**
        const activeSortBtn = document.querySelector(".sort-btn.active");
        const activeSortType = activeSortBtn ? activeSortBtn.getAttribute("data-sort") : "default";
        if (orderType === "ascending") {
            if (activeSortType === "totalRate") {
                sortedData.sort((a, b) => a.total_score - b.total_score);
            } else if (activeSortType === "firstYear") {
                sortedData.sort((a, b) => a.info[0].year - b.info[0].year);
            } else if (activeSortType === "lastYear") {
                sortedData.sort((a, b) => a.info[a.info.length-1].year - b.info[b.info.length-1].year);
            } else {
                sortedData = ANIMES; // 預設順序
            }
        } else if (orderType === "descending") {
            if (activeSortType === "totalRate") {
                sortedData.sort((a, b) => b.total_score - a.total_score);
            } else if (activeSortType === "firstYear") {
                sortedData.sort((a, b) => b.info[0].year - a.info[0].year);
            } else if (activeSortType === "lastYear") {
                sortedData.sort((a, b) => b.info[b.info.length-1].year - a.info[a.info.length-1].year);
            } else {
                sortedData = [...ANIMES].reverse(); // 預設順序
            }
        }
        printAnimes(sortedData);
    });
});

// 按鈕排序功能
document.querySelectorAll(".sort-btn").forEach(button => {
    button.addEventListener("click", function () {
        const sortType = this.getAttribute("data-sort");
        const container = document.getElementById("id_container");
        container.innerHTML = ""; // 清空容器
        let sortedData = [...ANIMES]; // 複製數據，避免修改原始數據
        // **取得當前 Order 的按鈕**
        const activeOrderBtn = document.querySelector(".order-btn.active");
        const activeOrderType = activeOrderBtn ? activeOrderBtn.getAttribute("data-order") : "acending";
        if (activeOrderType === "ascending") {
            if (sortType === "totalRate") {
                sortedData.sort((a, b) => a.total_score - b.total_score);
            } else if (sortType === "firstYear") {
                sortedData.sort((a, b) => a.info[0].year - b.info[0].year);
            } else if (sortType === "lastYear") {
                sortedData.sort((a, b) => a.info[a.info.length-1].year - b.info[b.info.length-1].year);
            } else {
                sortedData = ANIMES; // 預設順序
            }
        }
        else if (activeOrderType === "descending") {
            if (sortType === "totalRate") {
                sortedData.sort((a, b) => b.total_score - a.total_score);
            } else if (sortType === "firstYear") {
                sortedData.sort((a, b) => b.info[0].year - a.info[0].year);
            } else if (sortType === "lastYear") {
                sortedData.sort((a, b) => b.info[b.info.length-1].year - a.info[a.info.length-1].year);
            } else {
                sortedData = [...ANIMES].reverse(); // 預設順序
            }
        }
        
        printAnimes(sortedData);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    fetchExcel(); // 當頁面 DOM 載入後，自動讀取 Excel
});

function fetchExcel() {
    //var url = "https://raw.githubusercontent.com/rex0988476/test/main/data.xlsx";
    //var url = "data.xlsx";
    var url = "http://localhost:8000/data.xlsx";

    fetch(url)
    //fetch(url)
        .then(response => response.arrayBuffer()) // 取得 Excel 檔案為 ArrayBuffer
        .then(data => {
            var workbook = XLSX.read(data, { type: "array" });
            //get img links(第二個工作表)
            sheetName = workbook.SheetNames[1]; // 取得第二個工作表名稱
            var sheet_anime_imglinks = workbook.Sheets[sheetName]; //取得第二個工作表
            var anime_img_link_root = sheet_anime_imglinks["C2"].v;//圖片資料夾路徑
            var img_names = [];//所有圖片名稱
            var i=2;
            //start at B2, godown, interval=1, end at the first empty cell
            while(sheet_anime_imglinks["B"+i.toString()] && sheet_anime_imglinks["B"+i.toString()].v && sheet_anime_imglinks["B"+i.toString()].v.toString().trim() !== ""){//單元格不為 undefined、空白或純空格
                img_names.push(sheet_anime_imglinks["B"+i.toString()].v.toString());
                i++;
            }
            //document.write(img_names);
            //get anime(第一個工作表)
            /*
            A row: id, start at A8, godown, interval=6, end at the first empty cell
            B row: anime name, start at B8, godown, interval=6, end at the first empty cell
            C~L row: 
            -year: start at C~L8, godown, interval=6, end at the first empty cell
            -watched: start at C~L9, godown, interval=6, end at the first empty cell
            -total: start at C~L10, godown, interval=6, end at the first empty cell
            -date_start: start at C~L11, godown, interval=6, end at the first empty cell
            -date_end: start at C~L12, godown, interval=6, end at the first empty cell
            -score: start at C~L13, godown, interval=6, end at the first empty cell
            M row: total_score, start at M8, godown, interval=6, end at the first empty cell
            N row: types, start at N8, godown, interval=6, end at the first empty cell
            */
            var sheetName = workbook.SheetNames[0]; // 取得第一個工作表名稱
            var sheet_anime_info = workbook.Sheets[sheetName];// 取得第一個工作表    
            
            var anime_interval = 6;
            var sheet_anime_info_start_row = 8;
            var sheet_anime_info_seasons_start_char = 'C';

            var id = 0;
            var name_ = "";
            var img_link = "";
            var total_score = "";
            var types = "";

            var year = 0;
            var watched = 0;
            var total = 0;
            var date_start = "";
            var date_end = "";
            var score = 0;
            var title_row_colspan=0;//this.info.length+2;
            var type_row_colspan=0;//this.info.length+1;

            i=sheet_anime_info_start_row;
            var j=0;
            var k=0;
            var seasons_char = sheet_anime_info_seasons_start_char;
            while(sheet_anime_info["A"+i.toString()] && sheet_anime_info["A"+i.toString()].v.toString() && sheet_anime_info["A"+i.toString()].v.toString().trim() !== ""){//單元格不為 undefined、空白或純空格
                id = sheet_anime_info["A"+i.toString()].v;
                name_ = sheet_anime_info["B"+i.toString()].v.toString();
                img_link = anime_img_link_root + img_names[j];
                total_score = sheet_anime_info["M"+i.toString()].v;
                types = sheet_anime_info["N"+i.toString()].v.toString();
                ANIMES.push(new Anime(id, name_, img_link, total_score, types));
                k=0;
                seasons_char = sheet_anime_info_seasons_start_char;
                while(sheet_anime_info[seasons_char+i.toString()] && sheet_anime_info[seasons_char+i.toString()].v && sheet_anime_info[seasons_char+i.toString()].v.toString().trim() !== ""){//單元格不為 undefined、空白或純空格
                    year = sheet_anime_info[seasons_char+i.toString()].v;
                    watched = sheet_anime_info[seasons_char+(i+1).toString()].v;
                    total = sheet_anime_info[seasons_char+(i+2).toString()].v;
                    date_start = sheet_anime_info[seasons_char+(i+3).toString()].v;
                    date_end = sheet_anime_info[seasons_char+(i+4).toString()].v;
                    if (!(sheet_anime_info[seasons_char+(i+5).toString()] && sheet_anime_info[seasons_char+(i+5).toString()].v && sheet_anime_info[seasons_char+(i+5).toString()].v.toString().trim() !== "")){
                        score = "";
                    }
                    else{
                        score = sheet_anime_info[seasons_char+(i+5).toString()].v;
                    }
                    ANIMES[ANIMES.length-1].addInfo(year, watched, total, date_start, date_end, score);
                    k++;
                    seasons_char = String.fromCharCode(sheet_anime_info_seasons_start_char.charCodeAt(0) + k);
                }
                title_row_colspan=ANIMES[ANIMES.length-1].info.length+2;//this.info.length+2;
                type_row_colspan=ANIMES[ANIMES.length-1].info.length+1;//this.info.length+1;
                ANIMES[ANIMES.length-1].title_row_colspan = title_row_colspan;
                ANIMES[ANIMES.length-1].type_row_colspan = type_row_colspan;
                i+=anime_interval;
                j++;
            }
            printAnimes(ANIMES);
        })
        .catch(error => console.error("讀取 Excel 失敗", error));
    }

function printAnimes(animes) {
    //var seasons_name = ["第一季", "第二季", "第三季", "第四季", "第五季", "第六季", "第七季", "第八季", "第九季", "第十季"];
    var seasons_name = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];
    /*var year_name = "年份";
    var watched_total_name = "看過的集數 / 總集數";
    var release_date_name = "播放日期";
    var score_name = "評分";
    var type_name = "類型";
    var total_score_name = "總評分";
    */
    var year_name = "Year";
    var watched_total_name = "Progress";
    var release_date_name = "Release Date";
    var score_name = "Rate";
    var type_name = "Types";
    var total_score_name = "Total Rate";

    var i=0;
    var j=0;
    var s_container_start="";
    var s_container_end="";
    var s_cover="";
    var s_anime_info="";
    
    while(i<animes.length){
        //單個作品區塊（可複製多個）
        s_container_start = "<div class=\"anime-item active\">";
        //左側作品封面（可點擊）
        s_cover = "<div class=\"cover\" onclick=\"toggleAnimeInfo("+i.toString()+")\">" + "<img src=\""+animes[i].img_link+"\" alt=\"作品"+(i+1).toString()+"封面\">" + "</div>";
        //右側動畫資訊表格（初始隱藏）
        s_anime_info = "<div class=\"anime-info\">" + "<table class=\"anime-table\">";
        //動畫名稱
        s_anime_info += "<tr class=\"title-row\">";//title-row沒做事
        s_anime_info += "<td colspan=\""+animes[i].title_row_colspan.toString()+"\" class=\"anime-name\">"+animes[i].name+"</td>";
        s_anime_info += "</tr>";
        //第x季
        s_anime_info += "<tr class=\"header\">";//header沒做事
        s_anime_info += "<th></th>";
        //迴圈
        j=0;
        while(j<animes[i].info.length){
            s_anime_info += "<th>"+seasons_name[j]+"</th>";
            j++;
        }
        //迴圈end
        s_anime_info += "<th class=\"fixed-width\">"+total_score_name+"</th>";
        s_anime_info += "</tr>";
        //年份
        s_anime_info += "<tr>";
        s_anime_info += "<td>"+year_name+"</td>";
        //迴圈
        j=0;
        while(j<animes[i].info.length){
            s_anime_info += "<td>"+animes[i].info[j].year.toString()+"</td>";
            j++;
        }
        //迴圈end
        s_anime_info += "<td class=\"fixed-width\" rowspan=\"4\">"+animes[i].total_score.toString()+" / 10</td>";
        s_anime_info += "</tr>";
        //看過的集數 / 總集數
        s_anime_info += "<tr>";
        s_anime_info += "<td>"+watched_total_name+"</td>";
        //迴圈
        j=0;
        while(j<animes[i].info.length){
            s_anime_info += "<td>"+animes[i].info[j].watched.toString()+" / "+animes[i].info[j].total.toString()+"</td>";
            j++;
        }
        //迴圈end
        s_anime_info += "</tr>";
        //播放日期
        s_anime_info += "<tr>";
        s_anime_info += "<td>"+release_date_name+"</td>";
        //迴圈
        j=0;
        while(j<animes[i].info.length){
            s_anime_info += "<td>"+animes[i].info[j].date_start+" - "+animes[i].info[j].date_end+"</td>";
            j++;
        }
        //迴圈end
        s_anime_info += "</tr>";
        //評分
        s_anime_info += "<tr>";
        s_anime_info += "<td>"+score_name+"</td>";
        //迴圈
        j=0;
        while(j<animes[i].info.length){
            if (animes[i].info[j].score === ""){
                s_anime_info += "<td>-</td>";
            }
            else{
                s_anime_info += "<td>"+animes[i].info[j].score.toString()+" / 10</td>";
            }
            j++;
        }
        //迴圈end
        s_anime_info += "</tr>";
        //類型
        s_anime_info += "<tr>";
        s_anime_info += "<td>"+type_name+"</td>";
        s_anime_info += "<td colspan=\""+animes[i].type_row_colspan.toString()+"\">"+animes[i].types+"</td>";
        s_anime_info += "</tr>";
        s_anime_info += "</table>";
        s_anime_info += "</div>";
        //右側動畫資訊表格end
        //單個作品區塊end
        s_container_end = "</div>";
        document.getElementById("id_container").insertAdjacentHTML("beforeend",s_container_start+s_cover+s_anime_info+s_container_end);
        i++;
    }
}
function toggleAnimeInfo(index) {
    let animeItem = document.querySelectorAll(".anime-item")[index];
    let animeInfo = document.querySelectorAll(".anime-info")[index];
    let cover = document.querySelectorAll(".cover")[index];

    animeItem.classList.toggle("active");

    if (animeItem.classList.contains("active")) {
        animeInfo.style.visibility = "hidden";
        animeInfo.style.display = "flex";

        setTimeout(() => {
            let coverHeight = cover.offsetHeight;

            animeInfo.style.width = "70%";
            animeInfo.style.height = `${coverHeight}px`; // **確保高度與封面一致**
            animeInfo.style.visibility = "visible";
        }, 10);
    } else {
        animeInfo.style.width = "0";
        setTimeout(() => {
            animeInfo.style.display = "none";
            animeInfo.style.height = "100%"; // **確保收回時仍然等高**
        }, 300);
    }
}