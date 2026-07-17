**Flowcharts**

**Sitemap Tổng quan**

```mermaid
flowchart TD
    subgraph PUBLIC["Khu vực Public"]
        Landing["Trang chủ Landing (/)"]
        CourseList["Danh sách khóa học"]
        Login["Login"]
        Signup["Đăng ký"]
        Forgot["Quên mật khẩu /forgot-password"]
        Reset["Đặt lại mật khẩu /reset-password"]
        Verify["Trang xác nhận email /verify-email"]
    end

    subgraph ADMIN["Khu vực Admin"]
        AdminHome["Vai trò Admin /admin"]
        AdminDashboard["Thống kê /admin/dashboard"]
        AdminCourses["Quản lý khóa học /admin/courses"]
        AdminUsers["Quản lý người dùng /admin/user-management"]
    end

    subgraph USER["Khu vực Dashboard User"]
        DashHome["Dashboard chính /dashboard"]
        DashCourses["Khóa học /dashboard/courses"]
        DashLeaderboard["Bảng xếp hạng /dashboard/leaderboard"]
        DashAnalytics["Thống kê học tập /dashboard/analytics"]
        DashProfile["Hồ sơ học viên /dashboard/profile"]
        DashFlashcards["Ôn tập Flashcards /dashboard/flashcards"]
        DashCourseDetail["Chi tiết khóa học /dashboard/courses/:courseId"]
        DashAchievements["Thành tựu /dashboard/profile/achievements"]
        DashHistory["Lịch sử /dashboard/profile/history"]
    end

    Landing --> CourseList
    Landing --> Login
    Landing --> Signup
    Login --> Forgot --> Reset
    Signup --> Verify

    AdminHome --> AdminUsers
    AdminHome --> AdminDashboard
    AdminHome --> AdminCourses
    AdminHome --> AdminAchievements
    AdminHome --> AdminActivityLog

    DashHome --> DashCourses --> DashCourseDetail
    DashHome --> DashLeaderboard
    DashHome --> DashAnalytics
    DashHome --> DashProfile --> DashAchievements
    DashProfile --> DashHistory
    DashHome --> DashFlashcards
```

Đăng ký:

```mermaid
flowchart TD
    Start([Start: User truy cập /signup]) --> AuthChoice{Auth Method Choice?}

    AuthChoice -->|Google| GClick["Bấm 'Sign up with Google'"]
    GClick --> SignInAction["Kích hoạt Server Action: signInWithGoogle"]
    SignInAction --> OAuth["NextAuth Google OAuth 2.0 flow & Callback"]
    OAuth --> EmailExistsG{"User email đã tồn tại trong DB?"}
    EmailExistsG -->|Có| LogLoginG["Ghi activity: USER_LOGIN"]
    EmailExistsG -->|Không| InsertUserG["Thêm User vào DB & Ghi log: USER_REGISTER"]
    LogLoginG --> OnboardedG{"User đã hoàn thành onboarding?"}
    InsertUserG --> OnboardedG
    OnboardedG -->|Có| RedirectCoursesG["Chuyển hướng đến /dashboard/courses"]
    OnboardedG -->|Không| RedirectOnboardG["Chuyển hướng đến /onboarding"]

    AuthChoice -->|Credentials| FormInput["Nhập Họ tên, Email, Mật khẩu, Xác nhận mật khẩu"]
    FormInput --> PwMatch{"Confirm Password có trùng khớp không?"}
    PwMatch -->|Không| ShowValidationError["Hiển thị lỗi validation / Vô hiệu hóa nút Submit"]
    PwMatch -->|Có| CreateClick["Bấm 'Create account' -> kích hoạt register Form Action"]
    CreateClick --> RegisterAction["Server Action: registerUser"]
    RegisterAction --> EmailExistsC{"Email đã tồn tại trong DB?"}
    EmailExistsC -->|Có| ErrEmailExists["Trả lỗi: Email đã tồn tại"]
    EmailExistsC -->|Không| PwLength{"Password length hợp lệ?"}
    PwLength -->|Không| ErrPwShort["Trả lỗi: Mật khẩu quá ngắn"]
    PwLength -->|Có| HashPw["Băm mật khẩu bằng bcrypt"]
    HashPw --> InsertUserC["Thêm User vào DB & Ghi log: USER_REGISTER"]
    InsertUserC --> RedirectOnboardC["Chuyển hướng đến /onboarding"]
```

Đăng nhập:

```mermaid
flowchart TD
    Start([Start: User truy cập /login]) --> AuthChoice{Auth Method choice?}

    AuthChoice -->|Google| GClick["Bấm 'Log in with Google'"]
    GClick --> SignInAction["Kích hoạt Server Action: signInWithGoogle"]
    SignInAction --> Callback["NextAuth Google Sign-in callback"]
    Callback --> ExistsG{"User đã tồn tại trong DB?"}
    ExistsG -->|Không| InsertUserG["Thêm User vào DB & Ghi log USER_REGISTER"]
    ExistsG -->|Có| LogLoginG["Ghi activity: USER_LOGIN"]
    InsertUserG --> SetSession["Thiết lập Session Token & Cookies"]
    LogLoginG --> SetSession
    SetSession --> OnboardedG{"User đã hoàn thành onboarding?"}
    OnboardedG -->|Có| RedirectCoursesG["Chuyển hướng đến /dashboard/courses"]
    OnboardedG -->|Không| RedirectOnboardG["Chuyển hướng đến /onboarding"]

    AuthChoice -->|Credentials| EnterCred["Nhập Email & Mật khẩu / Chọn 'Ghi nhớ đăng nhập'"]
    EnterCred --> SubmitForm["Submit form -> kích hoạt LoginForm handleSubmit"]
    SubmitForm --> Authenticate["Gọi Server Action: authenticate"]
    Authenticate --> SignInCred["Gọi NextAuth signIn credentials"]
    SignInCred --> ZodValid{"Zod Schema validation passes?"}
    ZodValid -->|Không| ErrAuth1["Bắt AuthError: Hiển thị 'email/mật khẩu không đúng'"]
    ZodValid -->|Có| FetchUser["Truy vấn user từ DB theo email"]
    FetchUser --> UserHasPw{"User tồn tại & có password?"}
    UserHasPw -->|Không| ErrAuth2["Bắt AuthError: Hiển thị lỗi"]
    UserHasPw -->|Có| BcryptCompare{"bcrypt.compare match?"}
    BcryptCompare -->|Không| ErrAuth3["Bắt AuthError: Hiển thị lỗi"]
    BcryptCompare -->|Có| Authorize["NextAuth authorize() trả về user kèm rememberMe"]
    Authorize --> LogLoginC["NextAuth signIn() callback: Ghi activity USER_LOGIN"]
    LogLoginC --> JwtCallback["NextAuth jwt() callback: Set role & exp time"]
    JwtCallback --> RedirectDash["Chuyển hướng đến callbackUrl /dashboard"]
```

Onboarding

```mermaid
flowchart TD
    Start([Start: User visits /onboarding]) --> LoggedIn{"User đã đăng nhập?"}
    LoggedIn -->|Không| RedirectLogin["Chuyển hướng đến /login"]
    LoggedIn -->|Có| InitWizard["Khởi tạo state OnboardingWizard, điền sẵn thông tin"]
    InitWizard --> Step1["Bước 1: ProfileStep - Nhập Nickname, Bio, Location"]
    Step1 -->|Trở lại/Tiếp theo| Step2["Bước 2: AvatarStep - Chọn avatar seed"]
    Step2 -->|Trở lại| Step1
    Step2 -->|Finish| ClickFinish["Bấm Finish & Gọi Server updateOnboarding"]
    ClickFinish --> ServerAction["Server Action: updateOnboarding"]
    ServerAction --> UpdateDB["Cập nhật DB bảng users: set is_onboarded=true"]
    UpdateDB --> SyncToken["Gọi NextAuth unstable_update để đồng bộ token"]
    SyncToken --> EvalAchievements["Kiểm tra & evaluateAchievements (huy hiệu onboarding)"]
    EvalAchievements --> LogActivity["Ghi activity COMPLETE_ONBOARDING & revalidate cache"]
    LogActivity --> Success{"Cập nhật thành công?"}
    Success -->|Không| ShowError["Hiển thị cảnh báo lỗi & reset isLoading"]
    Success -->|Có| Step3["Bước 3: SuccessStep - Hiển thị màn chúc mừng"]
    Step3 --> ClickStart["Bấm 'Bắt đầu học'"]
    ClickStart --> RedirectCourses["Chuyển hướng: window.location.href = /dashboard/courses"]
```

Course discovery → learning flow

```mermaid
flowchart TD
    Start([Start: User truy cập Courses Dashboard /dashboard/courses]) --> ListCourses["Danh sách khóa học: chưa đăng ký & đã đăng ký - hiển thị title, ảnh, tiến độ"]
    ListCourses --> ClickCard["User bấm vào Course Card"]
    ClickCard --> RedirectDetail["Chuyển hướng: /dashboard/courses/:courseId"]
    RedirectDetail --> CourseDetail["Chi tiết khóa học: hiển thị curriculum - render sections & lessons"]
    CourseDetail --> FetchEnroll["Truy vấn trạng thái đăng ký"]
    FetchEnroll --> EnrollCheck{"Đã enroll chưa?"}

    EnrollCheck -->|Chưa| ClickEnroll["Bấm 'Enroll Now' -> gọi enrollInCourse"]
    ClickEnroll --> InsertEnroll["Thêm enrollment status ACTIVE - Tự động mở khóa lesson đầu tiên - Ghi activity ENROLL_COURSE"]
    InsertEnroll --> RenderTree

    EnrollCheck -->|Rồi| RenderTree["Hiển thị cây Curriculum - trạng thái unlocked/completed/locked - Cho phép bấm vào lesson đã mở khóa"]

    RenderTree --> ClickLesson["User bấm vào Lesson đã mở khóa"]
    ClickLesson --> RedirectLesson["Chuyển hướng: /courses/:courseId/lesson/:lessonId"]
    RedirectLesson --> LearnLesson["Học lesson: Render LessonContent & Note - Heartbeat API theo dõi thời gian active - Tự động hoàn thành khi đủ điều kiện - Tự động mở khóa lesson kế tiếp"]
    LearnLesson --> UnlockQuiz["Mở QuizAccessSection / User bấm 'Take quiz'"]
    UnlockQuiz --> RedirectQuiz["Chuyển hướng: /lesson/:lessonId/quiz"]
    RedirectQuiz --> DoQuiz["Làm quiz: Trả lời trong QuizContainer - Submit qua Server Action submitQuiz - chấm điểm & lưu quiz_attempts"]
    DoQuiz --> ViewResult["Xem kết quả -> Chuyển hướng /result/:attemptId - Hiển thị điểm, passed/failed, XP thưởng - Hiển thị giải thích đúng/sai"]
    ViewResult --> NextChoice{"User chọn bước tiếp"}
    NextChoice -->|Next Lesson| RenderTree
    NextChoice -->|Làm lại Quiz| DoQuiz
    NextChoice -->|Exit| ReturnCourse["Quay lại trang Course"]
    ReturnCourse --> End([End: Tiếp tục học / Kết thúc course lần này])
```

Học bài (lesson)

```mermaid
flowchart TD
    Start([Start: User mở lesson]) --> FetchLesson["Truy vấn dữ liệu lesson"]
    FetchLesson --> Rendered{"Đã completed?"}
    Rendered -->|Chưa| RenderPage["Render các thành phần trang Lesson"]
    RenderPage --> StartSession["POST /api/lesson-session/start"]
    Rendered -->|Rồi| SetCompleted["Đặt isCompleted=true / Render QuizAccessSection"]

    StartSession --> HeartbeatLoop["Mỗi 10 giây nếu tab active: gửi heartbeat"]
    HeartbeatLoop --> ServerAccum["Server: Cộng dồn thời gian active / Cập nhật last_heartbeat"]
    ServerAccum --> TabReplaced{"Session bị thay thế bởi tab khác?"}
    TabReplaced -->|Có| ShowBanner["Hiển thị SessionReplacedBanner / Dừng heartbeat"]
    TabReplaced -->|Không| DurationCheck{"Đã đủ required duration?"}
    DurationCheck -->|Chưa| HeartbeatLoop
    DurationCheck -->|Rồi| PostComplete["Post /api/lesson-session/complete"]
    PostComplete --> ServerComplete["Server: completeLesson action"]
    ServerComplete --> ProgressUpdate["Cập nhật tiến độ & phần thưởng"]
    ProgressUpdate --> ClientToast["Client: Hiển thị toast mở khóa / Hiệu ứng chúc mừng XP"]
    ClientToast --> SetCompleted
    SetCompleted --> End([End: Lesson complete / Start quiz])
```

Làm quiz

```mermaid
flowchart TD
    Start([Start: User vào trang quiz]) --> Published{"Course & Lesson đã published?"}
    Published -->|Không| NotFound1["Render giao diện NotFound"]
    Published -->|Có| FetchQuiz["Truy vấn quiz & câu hỏi từ DB"]
    FetchQuiz --> QuizExists{"Bài học này có Quiz?"}
    QuizExists -->|Không| NotFound2["Chuyển hướng đến giao diện NotFound"]
    QuizExists -->|Có| RenderQuiz["Render QuizContainer"]
    RenderQuiz --> Answer["User trả lời câu hỏi / Di chuyển giữa các câu"]
    Answer --> ClickSubmit["Bấm Submit -> gọi Server Action: submitQuiz"]
    ClickSubmit --> Grade["Server: Chấm điểm câu trả lời - Trắc nghiệm / Điền khuyết / Code"]
    Grade --> Calc["Tính toán điểm, Phần trăm & XpEarned / Kiểm tra nếu Passed"]
    Calc --> UpdateStats["Server: Cập nhật Streak, total_xp, Quests & Lưu attempt (attemptId)"]
    UpdateStats --> ShowToast["Client: Hiển thị thông báo / Chuyển hướng đến /quiz/result/:attemptId"]
    ShowToast --> RenderResult["Render QuizResultsContainer / Phần giải thích"]
    RenderResult --> End([Kết thúc Quiz])
```

XP và cấp độ

```mermaid
flowchart TD
    Start([Start: Thực hiện hoạt động]) --> Lesson["Lesson Completed: +xp_reward"]
    Start --> QuizAnswer["Quiz Answer Correct: +xp_reward per question"]
    Start --> Quest["Quest Completed: +reward_xp"]
    Start --> Achievement["Achievement Unlocked: +reward_xp"]

    Lesson --> UpdateXP["Cập nhật DB: total_xp = total_xp + XP nhận được"]
    QuizAnswer --> UpdateXP
    Quest --> UpdateXP
    Achievement --> UpdateXP

    UpdateXP --> CalcLevel["Gọi calculateLevel(totalXp)"]

    subgraph FN["Bên trong hàm calculateLevel()"]
        Init["level = 1
xpRemaining = totalXp
xpNeededForNextLevel = 500"]
        Init --> Check{"xpRemaining >= xpNeededForNextLevel?"}
        Check -->|Đúng| LevelUp["xpRemaining -= xpNeededForNextLevel
level++
xpNeededForNextLevel = 500 + (level-1)*200"]
        LevelUp --> Check
        Check -->|Sai| CalcProgress["progress = (xpRemaining / xpNeededForNextLevel) * 100"]
        CalcProgress --> ReturnResult["return { level, currentXpInLevel: floor(xpRemaining), nextLevelXp: xpNeededForNextLevel, progress }"]
    end

    CalcLevel --> Init
```

Streak

```mermaid
flowchart TD
    Start([Start: Thực hiện hoạt động]) --> UpdateStreakAction["Gọi Server Action: updateStreak"]
    UpdateStreakAction --> FetchStreak["Truy vấn current_streak, longest_streak, last_study_date"]
    FetchStreak --> IsToday{"last_study_date === today?"}
    IsToday -->|Có| NoUpdate["Không cập nhật, trả về số liệu hiện tại"]
    IsToday -->|Không| IsYesterday{"last_study_date === yesterday?"}
    IsYesterday -->|Có| Increment["newStreak = current_streak + 1 (tính streak mới)"]
    IsYesterday -->|Không| ResetStreak["newStreak = 1 (reset streak)"]
    Increment --> UpdateUsers["Cập nhật users: last_study=now, current_streak=newStreak, longest_streak=max(...)"]
    ResetStreak --> UpdateUsers
    UpdateUsers --> EffectiveCheck["getEffectiveStreak check: Nếu inactive >= 2 ngày -> display streak 0"]
```

Daily quests

```mermaid
flowchart TD
    Start([Start: User truy cập Dashboard]) --> GetQuests["Gọi getOrAssignDailyQuests"]
    GetQuests --> Assigned{"Assigned today?"}
    Assigned -->|Không| Shuffle["Xáo trộn và chọn 3 quest từ templates, thêm vào DB"]
    Assigned -->|Có| LoadProgress
    Shuffle --> LoadProgress["Tải tiến độ daily quests"]
    LoadProgress --> UserAction["User thực hiện các hành động học tập"]
    UserAction --> UpdateProgress["Gọi updateQuestProgress cho questType"]
    UpdateProgress --> Increment["Increment progress trong user_daily_quests"]
    Increment --> TargetCheck{"Progress >= target?"}
    TargetCheck -->|Không| ReturnUpdates["Trả về cập nhật & hiển thị thông báo tiến độ"]
    TargetCheck -->|Có| MarkComplete["Đánh dấu hoàn thành, nhận thưởng, cộng XP, chạy updateStreak & ghi log"]
    MarkComplete --> ReturnUpdates
```

Unlock Achievements

```mermaid
flowchart TD
    Start([Start: Một chỉ số của user vừa thay đổi- ví dụ: lên level, hoàn thànhlesson, cập nhật streak..]) --> EvalAction["Gọi Server Action evaluateAchievements"]
    EvalAction --> FetchIds["Truy vấn ID đã mở khóa & achievements còn khóa"]
    FetchIds --> HasLocked{"Còn achievements chưa mở khóa?"}
    HasLocked -->|Không| ExitEarly["Thoát sớm"]
    HasLocked -->|Có| GatherStats["Gather stats: Level, Lessons, Courses, Streak, Hours, Perfect Quizzes, Rank"]
    GatherStats --> Loop["Lặp qua achievements chưa mở: Kiểm tra unlock_condition"]
    Loop --> ConditionMet{"Điều kiện thỏa mãn?"}
    ConditionMet -->|Có| InsertUA["Thêm user_achievements, cộng XP, ghi log activity & thêm vào danh sách vừa mở khóa"]
    ConditionMet -->|Không| NextAch["Xét achievement tiếp theo"]
    InsertUA --> NextAch
    NextAch --> HasLocked
```

Leaderboard

```mermaid
flowchart TD
    Start([Start: User kiểm được XP]) --> UpdateXP2["SQL UPDATE users.total_xp"]
    UpdateXP2 --> VisitPage["User truy cập /dashboard/leaderboard"]
    VisitPage --> QueryDB["Query DB: lọc is_onboarded=true & loại bỏ ADMIN_EMAILS"]
    QueryDB --> OrderBy["ORDER BY total_xp DESC"]
    OrderBy --> MapRanks["Gán thứ hạng, tính level, avatar & chữ cái đầu, đánh dấu user hiện tại"]
    MapRanks --> Render["Hiển thị cúp cho Top 3, và danh sách cuộn bên dưới"]
```

Admin — Course management

```mermaid
flowchart TD
    Start([Start: Admin quản lý khóa học]) --> Choice{"Create New hay Edit?"}
    Choice -->|Create New| CreateNew["Tạo khóa học mới, nhập đầy đủ thông tin (Tên, Mô tả, Category, Level), "Save Course" status = draft"]
    Choice -->|Edit| LoadCourse["Tải khóa học hiện có (mọi status)"]
    CreateNew --> EditSections["Thêm/Sửa Sections & Lessons"]
    LoadCourse --> EditSections
    EditSections --> SaveCourse["Lưu khóa học + ghi log CREATE/UPDATE"]

    SaveCourse --> Draft["Status: DRAFT (bản nháp)"]
    Draft --> PublishClick["Xuất bản (Publish)"]
    PublishClick --> MeetsReq{"Đủ điều kiện? (>=3 lesson & >=1 quiz)"}
    MeetsReq -->|Không| ErrorBlock["Hiển thị lỗi, chặn xuất bản"]
    MeetsReq -->|Có| SetPublished["Đặt status = published + log PUBLISH"]

    SetPublished --> Published["Status: PUBLISHED (đã xuất bản)"]
    Published --> UnpublishClick["Gỡ xuất bản (Unpublish)"]
    UnpublishClick --> SetDraft["Đặt status về draft + log UNPUBLISH"]
    SetDraft --> Draft

    Draft --> DeleteClick["Xóa khóa học?"]
    Published --> DeleteClick
    DeleteClick -->|Có| DeleteCourse["Xóa khóa học + ghi log DELETE"]
```

Admin — Activity log

```mermaid
flowchart TD
    subgraph LOGGING["Ghi log"]
        Start1([Một user hoặc admin thực hiện một hành động- e.g. register, complete a lesson, publish a course...]) --> LogAction["Log the action - không block main flow nếu fail"]
        LogAction --> SaveLog["Lưu vào Activity Log - Ai đã làm gì? Và khi nào?"]
        SaveLog --> After90["Sau 90 ngày"]
        After90 --> DeleteOld["Xóa log cũ - yêu cầu trigger thủ công/cron, chưa tự động"]
    end

    subgraph VIEWING["Xem log"]
        Start2([Admin mở trang Activity Log]) --> Filter["Lọc theo: user, loại hành động, khoảng thời gian"]
        Filter --> FetchLogs["Truy vấn danh sách log + thống kê: hôm nay / tuần này / tháng này / tổng"]
        FetchLogs --> Display["Display: stat counters, log list dạng timeline, pagination"]
    end
```
