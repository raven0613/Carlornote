# Carlornote

這是一個以卡片為單位，可以隨心所欲地切換卡片，紀錄文字或圖片的筆記工具。

[DEMO](https://deck-crafter.vercel.app/)

![大圖](https://github.com/raven0613/deck_crafter/assets/93082842/d201fd58-609f-4298-a2da-34baab68c2f0)


## 登入

本工具需要註冊才能夠擁有自己的卡片，沒有註冊的話只能觀看有開啟公開權限的卡片


## 創建卡片

按左下的 + 號創建第一張屬於自己的卡片，點選卡片後再點選編輯按鈕來開啟卡片 modal，可以更換卡片圖以及卡片名稱

按 v 儲存結果


## 開始體驗

每一張卡片都有一塊自己的白板，白板上的元素可以自由拖曳、縮放、旋轉，以及加入圓角
※注意：我們在內容更動後五秒會儲存資料，在這個期間可以隨意切換卡片，但是關閉網頁可能會導致改動遺失

![BOX編輯](https://cdn.discordapp.com/attachments/1164423317239889931/1216417617108271304/BOX.gif?ex=6600502f&is=65eddb2f&hm=5a62ebde5ce5163152948212614fab3e9c998fff327038203d3b74181b304fb0&)


白板的元素分為四個種類，可以從畫面左邊的按鈕方塊拖曳，即拖即用


1. 文字方塊
2. 圖片
3. 程式碼方塊
4. 筆記方塊
5. 卡片方塊

以下一一介紹這五種方塊

### 文字方塊

可以設定整塊文字的 font size、font weight、font color

![textBox控制](https://github.com/raven0613/deck_crafter/assets/93082842/d6f2d6c0-78b7-43b2-b7ba-8144e75fadfe)


另外如果有複製文字，也可以在白板區直接 ctrl + v 貼上文字方塊

![textBox控制2](https://github.com/raven0613/deck_crafter/assets/93082842/c12f718b-4125-4da7-a862-ef4676d1c9e8)


### 圖片

從左邊拖曳進來的時候會是網址輸入框，按v可以直接顯示圖片

![imageBoxUrl](https://github.com/raven0613/deck_crafter/assets/93082842/a4fa316d-05ca-4fd3-befc-8457358147f4)


還有兩種方式可以新增圖片，第一是從電腦資料夾將圖片拖曳到白板上

![imageBox拖曳](https://github.com/raven0613/deck_crafter/assets/93082842/c2eadcd6-38a3-408e-bde0-8c4d4f247f4b)


第二是如果有先截圖，可以在白板區直接 ctrl + v 貼上截圖的圖片

![imageBox貼上](https://github.com/raven0613/deck_crafter/assets/93082842/e18378c5-0825-4ef1-b658-837453c4f854)


※注意：這兩種方式皆會在 imgur 將圖片上傳後用回傳的網址顯示

### 程式碼方塊

點選方塊左上角的按鈕可以切換編輯和顯示模式，右邊的下拉式選單可以選擇我們的程式碼所使用的語言，最右邊的按鈕則可以一鍵複製方塊內的程式碼

![codebox](https://github.com/raven0613/deck_crafter/assets/93082842/650272dc-08bf-4fbd-a36a-6bc4309489bc)



### 筆記方塊

支援 markdown 語法，點選方塊左上角的按鈕可以切換編輯和顯示模式

![markdownbox](https://github.com/raven0613/deck_crafter/assets/93082842/dc6f8be3-95f5-4f63-950c-68f7dce3ee88)


### 卡片方塊

只要將下方的卡片直接拖曳到白板上，就可以產生具有該卡片連結的卡片，閱讀者可以從一張卡片直接跳到連結的卡片


### 自由操作方塊

每一個方塊本身都可以縮放、旋轉，以及加入圓角

每次點選方塊，被選擇的方塊都會跳到圖層最上方

![BOX圖層控制](https://github.com/raven0613/deck_crafter/assets/93082842/d8f4ec13-cb21-422a-a293-b49ca5ad37a4)


點擊 undo 與 redo icon 可以回復或重作步驟，需注意切換卡片後保存的步驟將會重置

![復原重複](https://cdn.discordapp.com/attachments/1164423317239889931/1217512744824340560/BOX.gif?ex=66044c1a&is=65f1d71a&hm=a17c000e82a28b2e9c6fb3b1a6a17d27b4f9803ded0c07d0a24c7095dd1bb124&)

## 卡片的權限設定

- 卡片權限設定

點選下方卡片的編輯 icon，在跳出的 modal 視窗上可以設定卡片的觀看以及編輯權限  
當選擇私密觀看後，編輯權限便會關閉；當選擇限制觀看後，編輯權限便不能選擇公開

![卡片權限](https://cdn.discordapp.com/attachments/1164423317239889931/1217512743607992360/11e359e89712d14e.gif?ex=66044c1a&is=65f1d71a&hm=453f4e67e4ec3455857dbe46da5ae457d8b4051ba5a06a0708b2beb17287c812&)

- 權限名單設定

modal 視窗右下角可以設定權限名單，可以加入其他使用者的 e-mail，再將觀看權限或是編輯權限設定為「限制」，就可以只開放給特定的使用者觀看或是編輯卡片

![權限名單](https://cdn.discordapp.com/attachments/1164423317239889931/1217512744287342712/4add30ab904129dd.gif?ex=66044c1a&is=65f1d71a&hm=6e96e39950c3476e77a274d8e3e841fd295080298328ed18b4bf6509837db0c3&)

最後必須點擊綠色勾勾按鈕，才會儲存設定結果

## 使用手機操作 deck crafter

電腦版的右側小耳朵點開，會將卡片上的所有元素，依照圖層上下來顯示，在手機上操作時，會以操作這個區塊為主，點選方塊後會顯示所有可操作按鈕

![image](https://github.com/raven0613/deck_crafter/assets/93082842/57dcf3e8-e285-4a9a-bc84-78903b2451f6)

1. 重新定位：如果找不到某個方塊的位置，使用重新定位可以直接把元素拉到白板的左上角
2. 上鎖/開鎖：上鎖後能使方塊不能被點選和編輯
3. 隱藏/顯示：可以將方塊從白板中隱藏
4. 移到圖層最下方
5. 移到圖層最上方
6. 刪除方塊

如果是程式碼方塊，或是筆記方塊，都有一個擴張/收合的按鈕，可以一次顯示較多或是較少內容

![手機文章擴張](https://github.com/raven0613/deck_crafter/assets/93082842/8659a17a-54f9-47c9-a2f3-5108614e078e)
