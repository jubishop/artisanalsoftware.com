# PodHaven website feature accounting

Audited 2026-09-04 against PodHaven `main` at `f1d6e2b2acb724a468876ef387dbb59daa03666b`. Website base: `80c8adc2827854891b576a1b6f38728428880197`.

Current app code is the authority for behavior. The ML and transcription initiative documents helped identify areas to inspect, but they contain old decisions and deferred work. The copy below reflects implemented user-facing behavior, rather than every proposal in those documents.

## Editorial priorities

The homepage leads with recommendations powered entirely on device, Smart Lists and flexible filters, and extensive settings and customization. These areas lead the feature index, navigation, and featured guide links. Up Next and Smart Lists occupy the hero; settings have their own screenshot showcase. Transcription has a smaller, single-screenshot callout near the bottom of the homepage, after the everyday listening section. Its dedicated feature page and guide remain available.

## Coverage

Source paths are relative to `jubishop/podhaven`. Website paths are the draft routes, pending publication.

| User-facing area | Source evidence | Website coverage |
| --- | --- | --- |
| On-device semantic recommendations from episode and podcast text | `PodHaven/Recommendations/Embeddings/EmbeddingService.swift`, `RecommendationEngine.swift` | `/podhaven/recommendations`; recommendations guide |
| Love, Like, Dislike, Not Interested; clear/change ratings; batch ratings | `PodHaven/Views/Components/RatingMenuButtons.swift`, episode selection/context menu protocols | Recommendations; queue; recommendations and listening guides |
| Actual playback coverage, minimum signal thresholds, explicit rating precedence | `PodHaven/Recommendations/Models/PartialSignal.swift`, `RecommendationEngine.swift` | Recommendations; recommendations guide |
| Recommendation scores and reason chips | `RecommendationEngine.swift`, `PodHaven/Views/Episodes/EpisodeDetailView.swift` | Recommendations; recommendations guide |
| Focused / Exploratory and Podcast Affinity | `PodHaven/Views/Settings/SettingsView.swift` | Recommendations; settings reference |
| Recommendations in Up Next; count/hide; optional auto-play | `SettingsView.swift`, `PodHaven/Views/UpNext/UpNextView.swift` | Recommendations; queue; settings reference |
| Search and chart Top Picks, including unsubscribed shows | `PodHaven/Views/Search/SearchView.swift`, `SearchDiscoveryListView.swift`, `Models/SearchRecommendationCollector.swift` | Recommendations; library; getting started and recommendations guides |
| Recommendation sorting within supported episode lists | `PodHaven/Views/Episodes/Models/SmartListSortMethod+SortingMethod.swift`, `PodHaven/Views/Podcasts/Models/PodcastDetailViewModel.swift` | Recommendations; Smart Lists; recommendations guide |
| Automatic or manual per-show freshness cadence, including Evergreen | `PodHaven/Views/Podcasts/PodcastSettingsView.swift`, `PodHaven/Recommendations/Models/FreshnessSignal.swift` | Recommendations; per-podcast and settings guides |
| On-device transcription, English (US), device/model availability | `PodHaven/Transcriptions/TranscriptionAvailability.swift`, `Transcriber.swift` | Transcripts; transcript guide |
| Publisher timed transcript imports, source labels, local replacement | `PodHaven/Database/PublisherTranscriptImportStore.swift`, `PodHaven/Views/Episodes/Components/EpisodeDetailTranscriptView.swift`, transcription processor | Transcripts; transcript guide |
| Description / Transcription detail view | `EpisodeDetailView.swift`, `EpisodeDetailTranscriptView.swift` | Transcripts; transcript guide |
| Synchronized player transcript, current block highlighting, expand/collapse | `PodHaven/Views/PlayBar/PlayBarSheet.swift`, `Components/PlayBarTranscriptView.swift` | Transcripts; player; transcript guide |
| Episode, player, context menu, swipe, and batch transcription requests | `PodHaven/Views/Components/TranscriptionToolbarButton.swift`, episode context and selection protocols | Transcripts; queue; transcript/listening guides |
| Durable transcription queue, ordering, Transcribe Now, multi-select, 10–100 limit | `PodHaven/Views/Settings/TranscriptionQueue/TranscriptionQueueView.swift`, `SettingsView.swift` | Transcripts; transcript and settings guides |
| Transcription progress, pause/resume, discard confirmation, retries/checkpoints | `EpisodeDetailTranscriptView.swift`, `PodHaven/Transcriptions/TranscriptionProcessor.swift` | Transcripts; transcript guide |
| Per-show automatic transcription of newly discovered episodes | `PodcastSettingsView.swift`, feed refresh/transcription queue admission | Transcripts; per-podcast and transcript guides |
| Smart Lists with All/Any, condition groups, creation/edit/delete/reorder | `PodHaven/Views/Episodes/EpisodesView.swift`, `SmartListEditor/SmartListEditorView.swift`, `PodHaven/Database/Models/SmartListFilter.swift` | Smart Lists; Smart Lists guide |
| Text/phrase and transcript filters; listening, queue, storage, rating states; date and duration | `SmartListFilter.swift`, `PodHaven/Database/SmartListFilterEngine.swift` | Smart Lists; complete filter list and recipes in Smart Lists guide |
| Per-list sort, icons, podcast artwork preference, unread badges | `PodHaven/Database/Models/SmartList.swift`, `SmartListSortMethod.swift`, Smart List editor | Smart Lists; Smart Lists guide |
| Podcast and episode tags, icon choice, counts, rename/delete | `PodHaven/Views/Settings/Tags/`, `PodHaven/Views/Components/TagMenu.swift` | Smart Lists; library; Smart Lists and settings guides |
| Library grid/list, tags/untagged, sorting, show detail, episode text filtering | `PodHaven/Views/Podcasts/`, `Utility/EpisodeListFilter.swift` | Library; getting started guide |
| Directory search, charts, manual RSS entry | `PodHaven/Views/Search/` | Library; getting started guide |
| OPML import/export and progress/results | `PodHaven/Views/Settings/OPML/` | Library; getting started guide; settings reference |
| Share extension, OPML sharing, podcast and episode links, timed episode sharing, web episode player | `PodHavenShare/`, `PodHaven/Share/`, `ShareEpisodeButton.swift`; existing website RSS routes | Library; sharing guide; RSS routes retained |
| Play Bar, episode artwork link, expansion, shrink on scroll | `PodHaven/Views/PlayBar/` | Player; customization; listening/settings guides |
| Global, per-show, per-episode playback speed; independent skip intervals | `SettingsView.swift`, `PodcastSettingsView.swift`, Play Bar | Player; listening, per-podcast, and settings guides |
| Undo Seek, furthest position, embedded chapters, show-note timestamp links | `PlayBarSheet.swift`, `Models/PlayBarViewModel.swift`, `PodHaven/Views/Components/HTMLContent.swift` | Player; listening guide |
| AirPlay/Bluetooth and system Now Playing controls; configurable Next Track and scrubbing | `PodHaven/Play/`, `SettingsView.swift` | Player; listening/settings guides |
| Remote Like / Dislike actions for ratings, saving, or tags | `PodHaven/Views/Settings/Components/CommandCenterFeedbackMenu.swift` | Player; customization; listening/settings guides |
| Up Next top/bottom insertion, reorder, max queue, duration, optional Now Playing | `PodHaven/Views/UpNext/`, `PodHaven/Database/Queue.swift`, `SettingsView.swift` | Queue; listening/settings guides |
| Per-show auto-queue and keep-latest episode limits | `PodcastSettingsView.swift` | Queue; per-podcast guide |
| Multi-select/batch actions, context menus, fixed right swipes, custom left swipes | Episode and podcast selection protocols; `PodHaven/Views/Settings/SwipeActions/` | Queue; customization; listening guide |
| Cache/download progress, Save in Cache, eligible eviction, storage budget | `PodHaven/Cache/`, `SettingsView.swift` | Offline; offline/settings guides |
| Per-show automatic Cache / Save; background feed refresh | `PodcastSettingsView.swift`, feed refresh | Offline; offline/per-podcast guides |
| System/Light/Dark, Dynamic Type, VoiceOver, remaining time, artwork choices | `SettingsView.swift`, accessible SwiftUI controls and transcript views | Customization; settings reference |
| Home Screen Now Playing, Queue, combined widget | `PodHavenWidget/NowPlaying/`, `Queue/`, `NowPlayingQueue/` | Customization; sharing/widgets guide |
| Lock Screen Now Playing and Control Center play/pause/back/forward | `PodHavenWidget/LockScreenNowPlaying/`, `ControlCenter/` | Customization; sharing/widgets guide |
| Per-show new-episode notifications, permissions, artwork, episode links | `PodcastSettingsView.swift`, `PodHaven/Notification/` | Customization; per-podcast/sharing guides |
| In-app feedback and project/community links | `SettingsView.swift`, `FeedbackFormView.swift` | Customization; sharing/settings guides; footer |
| Diagnostic scope alongside local ML | `PodHaven/AppLauncher.swift` Sentry configuration and feedback attachments | Recommendations; corrected studio homepage summary |

## Corrections made to older website claims

- Not Interested hides a recommendation; it does not train the negative profile.
- A short listen is not a negative signal. Only qualifying actual coverage contributes implicit positive interest; explicit ratings take precedence.
- Scores are rescaled rankings, not probabilities of enjoyment or guaranteed matches.
- Freshness multiplies the base score by an age-dependent factor. It is not an additive boost that disappears after a fixed day.
- The skip interval choices are discrete: 5, 10, 15, 30, 45, 60, 75, 90 seconds, not all five-second increments.
- Saved audio can exceed the cache budget. The site does not promise an absolute app-storage ceiling.
- Search recommendations and Smart Lists are now represented; the old “six features” summary has been replaced.
- Removed “zero trackers,” “no analytics SDKs,” “nothing leaves your phone,” and cross-device-sync implications from PodHaven copy. The recommendation engine is local; the app has network services and Sentry diagnostics.
- Background refresh and transcription have no guaranteed completion or notification time.
- A feed import does not automatically transcribe its entire back catalog.
- The static transcript reader currently presents paragraphs; the website does not claim tap-to-seek words, speaker identification, or global transcript search.

## Not advertised as available

Auto-skip silence, generated summaries/chapters, clip creation, speaker diarization, cloud library sync, a dedicated Watch app, and transcript-based recommendation embeddings are not represented as current features. The implemented ML recipe uses episode and podcast metadata. Publisher transcripts can preserve languages other than the local English (US) speech model, but availability depends on what a publisher supplies.

The existing “App Store coming soon” status is retained. This audit does not claim a newly published listing or change distribution policy.

## Website implementation

- Eight feature pages and nine guide articles, plus the landing page and guide index.
- Existing public feature/guide URLs are retained. New routes: `/podhaven/transcripts`, `/podhaven/smart-lists`, and their guide counterparts.
- Static editorial content lives in `content/podhaven-features.js` and `content/podhaven-guides.js`; shared EJS renders the pages, navigation, contents links, and screenshot galleries.
- The site remains server-rendered with no client-side JavaScript.
- The PodHaven redesign uses `public/css/podhaven.css`. The studio homepage keeps its existing stylesheet and layout; only its PodHaven summary/privacy claims changed.
- See [the screenshot inventory](podhaven-screenshots.md) for the 29 named capture slots: 19 new and 10 replacements. These are asset requests, not fabricated app screens.

## Validation

- The four new routes and homepage links were tested failing before implementation, then passing.
- Route checks cover all 19 PodHaven pages, one H1 per page, canonical URLs, local navigation and fragment targets, available image files, image alt attributes, and absence of client-side scripts.
- The existing test suite still covers RSS rendering, metadata, input validation, and deep links.
- Browser verification covers desktop and narrow layouts, guide navigation, screenshot links, keyboard access, and console errors. The screenshot inventory is intentionally incomplete until the user supplies captures.

Browser readback: 76 page/width checks passed (all 19 pages at 320, 390, 768, and 1440 CSS pixels) with JavaScript disabled, no horizontal overflow, and no browser errors. Keyboard focus and the Skip to content link were verified. Standard full-suite attempts hit intermittent five-second timeouts in unchanged RSS episode tests on a heavily loaded host; all 103 tests passed in a temporary copy with 60-second test timeouts to verify assertions without changing repository test budgets. The pre-existing rate-limiter IPv6 configuration warning remains outside this website change.

Final homepage callout verification passed at 320, 390, 600, 768, and 1440 CSS pixels, including its placement after the primary feature sections. Desktop and phone screenshots were inspected. The final pre-commit test run passed 98 tests; five existing RSS/metadata tests timed out at their five-second limit and then all passed in a focused rerun with a 60-second limit. No repository test limits were changed.
