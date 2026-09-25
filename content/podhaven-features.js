module.exports = {
  recommendations: {
    label: 'Recommendations',
    title: 'A little less searching. A lot more listening.',
    description: 'On-device machine learning turns your ratings and listening into personal episode recommendations, in your library and beyond.',
    intro: 'Find the next episode worth your time. PodHaven learns from the shows and subjects you enjoy, explains its picks, and lets you decide how far to explore.',
    guide: 'training-recommendations',
    sections: [
      {
        id: 'personal', title: 'Your taste is the starting point.',
        body: `<p>PodHaven uses on-device machine learning to compare the meaning of episode titles, descriptions, and podcast information. Your ratings and qualifying listening history shape a personal recommendation profile.</p><p>Suggestions appear below your queue in <strong>Up Next</strong>. You can also sort supported episode lists by <strong>Recommendation</strong> to find promising episodes within a particular collection.</p><p>In Search, open <strong>Top Picks</strong> to explore personalized episode recommendations from search results or a chart category, including shows you have not subscribed to.</p>`,
        screenshots: ['up-next', 'search-picks']
      },
      {
        id: 'feedback', title: 'A few taps make your preferences clear.',
        body: `<dl><dt>Love</dt><dd>A strong positive signal for similar content.</dd><dt>Like</dt><dd>A positive signal, with less weight than Love.</dd><dt>Dislike</dt><dd>Teaches the engine to move away from similar content.</dd><dt>Not Interested</dt><dd>Hides that episode from recommendations without training the model.</dd></dl><p>Rate from episode details, the player, an episode’s context menu, or a batch selection. You can change or clear a rating later.</p><p>Actual listening also contributes a weaker positive signal. Skipping ahead does not count as hearing the skipped section. Leaving early does not act as a Dislike, and an explicit rating takes precedence over listening history for that episode.</p>`,
        screenshots: ['recommendation-detail']
      },
      {
        id: 'reasons', title: 'A recommendation you can inspect.',
        body: `<p>An episode can show <strong>Similar to others</strong>, <strong>Preferred podcast</strong>, and <strong>Fresh</strong> when those factors support its recommendation.</p><p>The <strong>Recommendation score</strong> helps compare candidates. It is a relative ranking score, scaled for display, rather than a probability that you will enjoy an episode. A score of 100% does not guarantee a perfect pick.</p><p>Freshness follows each show’s publishing rhythm. Older news loses priority sooner than a monthly series. Choose <strong>Evergreen</strong> for a back catalog where age should not reduce the score.</p>`,
        screenshots: []
      },
      {
        id: 'controls', title: 'Stay close. Or get curious.',
        body: `<p><strong>Recommendation Diversity</strong> offers Focused and Exploratory modes. Focused stays closer to shows you have rated. Exploratory helps topics travel across different show formats.</p><p><strong>Podcast Affinity</strong> sets how much a show’s rating history matters compared with the episode’s content. Choose from 0–50%; the default is 10%.</p><p>Show up to 20 recommendations in Up Next, hide the section, or enable <strong>Auto-play Recommendation</strong> to continue with the top available pick after your queue empties.</p><p>The recommendation model and scoring run on your device. Podcast search, feeds, and downloads still use the network. PodHaven also uses Sentry for diagnostics and feedback; on-device recommendations do not mean the app makes no external connections.</p>`,
        screenshots: ['recommendation-settings']
      }
    ]
  },
  'smart-lists': {
    label: 'Smart Lists & filters',
    title: 'A list for every kind of listening.',
    description: 'Build live episode collections with Smart Lists, custom tags, transcript phrases, flexible conditions, sorting, and unread badges.',
    intro: 'A short commute. A long walk. An idea you want to return to. Make collections that update as your library and listening change.',
    guide: 'smart-lists',
    sections: [
      {
        id: 'collections', title: 'Set the rules. Your library does the rest.',
        body: `<p>The <strong>Episodes</strong> tab is home to your Smart Lists. Create a named list, give it an icon, and choose the conditions an episode must meet. Results update as episodes arrive or their state changes.</p><p>Combine conditions with <strong>All</strong> or <strong>Any</strong>. Add groups when you need a rule such as “unfinished and either liked or loved.” Reorder your lists to keep the most useful ones at the top.</p><p>Optional unread badges count newly added matching episodes since you last viewed that list. They do not count every unfinished episode.</p>`,
        screenshots: ['smart-lists', 'smart-list-editor']
      },
      {
        id: 'filters', title: 'Get specific about what belongs.',
        body: `<ul><li><strong>Episode and podcast text:</strong> include or exclude a phrase in titles, descriptions, or either.</li><li><strong>Transcription:</strong> match a phrase in stored transcript text.</li><li><strong>Listening and queue state:</strong> started, unstarted, finished, unfinished, queued, unqueued, or previously queued.</li><li><strong>Storage and ratings:</strong> cached, uncached, saved, loved, liked, disliked, not interested, rated, or unrated.</li><li><strong>Transcript availability:</strong> transcribed or not transcribed.</li><li><strong>Tags:</strong> a particular tag, no particular tag, any tag, or no tags.</li><li><strong>Time:</strong> a duration range, published within a number of days, or older than a number of days.</li></ul><p>Sort a list by publication date, date added, duration, recently finished, recently queued, or Recommendation. Each list remembers its sort choice and can use podcast artwork throughout.</p>`,
        screenshots: []
      },
      {
        id: 'tags', title: 'Tag a whole show. Or just one great episode.',
        body: `<p>Create custom tags with your own names and icons in <strong>Settings → Organization → Tags</strong>. Apply them to podcasts, individual episodes, or a selection of items.</p><p>A Smart List’s tag condition matches tags on either the episode or its podcast. Tag a show “History” once, then tag a particular episode “Revisit” when it deserves another listen.</p><p>The tag manager shows usage counts and supports renaming, changing icons, and deleting tags. You can also filter your Podcasts library by tag and find untagged shows.</p>`,
        screenshots: ['podcast-tags', 'tag-manager']
      }
    ]
  },
  customization: {
    label: 'Settings & customization',
    title: 'Every detail, your way.',
    description: 'Customize appearance, gestures, artwork, remote controls, widgets, notifications, and settings for each podcast.',
    intro: 'Put the controls you use where you expect them. Give each show its own routine, and make PodHaven comfortable to read and easy to reach.',
    guide: 'settings',
    sections: [
      {
        id: 'appearance', title: 'Comfortable at a glance.',
        body: `<p>Choose <strong>System</strong>, <strong>Light</strong>, or <strong>Dark</strong> appearance. PodHaven supports Dynamic Type and VoiceOver, including labels, actions, selection states, and transcript reading.</p><p>Show time remaining in episode lists, shrink the Play Bar while scrolling, and choose podcast or episode artwork for supported surfaces. Custom icons give tags and Smart Lists a recognizable place in your library.</p>`,
        screenshots: ['light-mode']
      },
      {
        id: 'actions', title: 'Put your frequent actions first.',
        body: `<p>Choose and reorder up to three left-swipe actions: Play/Pause, Rate, Mark Finished, Cache, Save in Cache, Tag, or Transcribe when available. The first action is the one a full swipe triggers.</p><p>Configure Next Track behavior and the Like and Dislike actions used by supported remotes. Set playback speed, silence skipping, Quiet Audio Protection, queueing, downloads, transcription, freshness, and notifications independently for each podcast.</p>`,
        screenshots: ['swipe-settings', 'remote-settings']
      },
      {
        id: 'widgets', title: 'Keep the next listen in reach.',
        body: `<p>Choose <strong>Now Playing</strong>, <strong>Up Next</strong>, or the combined <strong>Now Playing &amp; Up Next</strong> Home Screen widget. Use the available playback actions and episode links without first navigating through the library.</p><p>Control playback from the Lock Screen with system Now Playing. You can also add PodHaven’s own Now Playing widget. In Control Center, add dedicated <strong>Play/Pause</strong>, <strong>Skip Backward</strong>, and <strong>Skip Forward</strong> controls.</p>`,
        screenshots: ['widgets', 'lock-screen']
      },
      {
        id: 'notifications', title: 'Hear about the shows that matter.',
        body: `<p>Enable <strong>Notify New Episodes</strong> for individual podcasts. Notifications discovered during background refresh can include artwork and open the episode directly. Notification permission and iOS background scheduling affect delivery.</p><p>For help or a problem report, use <strong>Send Feedback</strong> in release builds. You can also find the community Discord, website, and source repository from Settings.</p>`,
        screenshots: []
      }
    ]
  },
  player: {
    label: 'Player',
    title: 'Stay in the story.',
    description: 'Find your pace with configurable silence skipping, playback speed, chapters, and Undo Seek. Take your queue, Smart Lists, and podcasts into CarPlay.',
    intro: 'Small, useful controls for the way you listen. Keep the player close while browsing, then open it when the episode deserves your full attention.',
    guide: 'listening-tactics',
    sections: [
      {
        id: 'playbar', title: 'From a small Play Bar to the full conversation.',
        body: `<p>The Play Bar stays available while you browse. Tap its artwork to open the episode, or its expansion control to reveal the player, artwork, speed, sharing, ratings, and playback controls.</p><p>Choose <strong>Shrink Playbar</strong> to reclaim space as you scroll. For a transcribed episode, expand further to follow the synchronized text.</p>`,
        screenshots: ['player', 'transcript-player']
      },
      {
        id: 'pace', title: 'Find your pace. Find your place.',
        body: `<p>Set playback speed from <strong>0.8× to 2.0×</strong>, in 0.1× steps. Choose a global default, override it for a podcast, or adjust an individual episode.</p><p>Forward and backward skip intervals are independent: <strong>5, 10, 15, 30, 45, 60, 75, or 90 seconds</strong>. Set a short rewind to hear a sentence again and a longer forward skip when you need it.</p><p><strong>Undo Seek</strong> lets you return after moving the progress bar. The player also offers a return to your furthest played position after you go back. Timestamps in the episode description provide chapter markers and previous and next chapter controls.</p><p>Episode descriptions retain the publisher’s formatting and links. Recognized timestamps in show notes let you jump to the referenced moment.</p>`,
        screenshots: ['chapter-player']
      },
      {
        id: 'silence-skipping', title: 'Less silence. More conversation.',
        body: `<p><strong>Shorten Silence</strong> skips clear pauses in downloaded episodes while keeping space around speech. Choose <strong>Gentle</strong>, <strong>Balanced</strong>, or <strong>Aggressive</strong> to control how much is shortened. Choose <strong>Off</strong> to keep the original pauses. Higher playback speeds shorten pauses a little more automatically.</p><p>Set a global default, give a podcast its own setting, or make a temporary choice in the expanded player. <strong>Quiet Audio Protection</strong> lets you protect fainter sounds or allow more background noise within a pause.</p><p>Silence skipping requires downloaded audio and completed audio analysis. Playback continues normally while analysis is pending. <a href="/podhaven/guides/listening-tactics#silence-skipping">Set up silence skipping</a>.</p>`,
        screenshots: []
      },
      {
        id: 'carplay', title: 'Your next listen, on the road.',
        body: `<p>Open PodHaven on your car’s <strong>CarPlay</strong> display to browse <strong>Up Next</strong>, your saved <strong>Smart Lists</strong>, and subscribed <strong>Podcasts</strong>. Pick an episode and use Now Playing to pause, skip, or change playback speed.</p><p>CarPlay uses the same queue and player as your iPhone. Download episodes before a trip for offline listening, and keep your favorite shows ready for the drive. <a href="/podhaven/guides/listening-tactics#carplay">Get started with CarPlay</a>.</p>`,
        screenshots: []
      },
      {
        id: 'remote', title: 'Carry your controls into the day.',
        body: `<p>Use system audio output with AirPlay and Bluetooth, plus Now Playing controls on the Lock Screen, Control Center, and compatible car or headphone remotes.</p><p>Set <strong>Next Track Behavior</strong> to Next Episode, Skip Interval, or Next Chapter. Chapter mode falls back to your skip interval when chapters are unavailable.</p><p>Disable <strong>Command Center Scrubbing</strong> if accidental progress-bar movements are a problem. Where a remote exposes Like and Dislike, choose rating, saving, or tagging actions in Settings.</p>`,
        screenshots: ['remote-settings']
      }
    ]
  },
  queue: {
    label: 'Queue',
    title: 'Line up a good listen.',
    description: 'Arrange Up Next, automate selected shows, limit the backlog, and manage several episodes together.',
    intro: 'Build an afternoon of listening or keep just the next few episodes ready. Your queue has room for a plan and for a good recommendation.',
    guide: 'listening-tactics',
    sections: [
      {
        id: 'up-next', title: 'The next episode is your call.',
        body: `<p>Add episodes to the top or bottom of <strong>Up Next</strong>. Drag to reorder, move entries, or remove them from the queue. The total duration shows how much listening you have lined up.</p><p>Keep Now Playing visible at the top if you want. Choose podcast artwork separately for the queue, recommendations, and Now Playing.</p><p>Set the queue’s maximum length from <strong>10–100 episodes</strong>. Adding at the bottom fills available room. Adding at the top can remove entries from the end to stay within the limit.</p>`,
        screenshots: ['up-next']
      },
      {
        id: 'automatic', title: 'Make room for your regulars.',
        body: `<p>In each podcast’s settings, choose <strong>Queue All Episodes → On Top</strong> or <strong>On Bottom</strong> to add new episodes automatically.</p><p>Enable <strong>Limit Episodes</strong> to keep only the latest chosen number from that show when new episodes are auto-queued. A daily show can stay current without taking over the whole queue.</p><p>When the queue ends, <strong>Auto-play Recommendation</strong> can continue with the top available recommendation. Turn it off when you want playback to stop at the end of your planned listening.</p>`,
        screenshots: ['podcast-settings']
      },
      {
        id: 'batch', title: 'Take care of a few episodes at once.',
        body: `<p>Enter selection mode to apply supported actions to several episodes: queue, download, save, finish, rate, tag, or transcribe. Use Replace Queue when the selected episodes should become your new listening plan. Context menus give you actions without opening each episode.</p><p>Queue shortcuts live on right swipes. Choose up to three <strong>Swipe Left Actions</strong>, put them in your preferred order, and inspect the preview in Settings.</p>`,
        screenshots: ['batch-actions', 'swipe-settings']
      }
    ]
  },
  library: {
    label: 'Library & discovery',
    title: 'Follow your curiosity.',
    description: 'Discover podcasts through search and charts, add RSS feeds, import OPML subscriptions, and organize your collection.',
    intro: 'Find a familiar voice or a show you have never heard of. Bring your subscriptions, browse at your own pace, and keep your library organized.',
    guide: 'getting-started',
    sections: [
      {
        id: 'discover', title: 'A whole world of shows to explore.',
        body: `<p>Search the Apple podcast directory by show name or keyword. Browse <strong>Top Podcasts</strong> and genre charts, then pull to refresh for current results.</p><p>Open a show to read its description and explore episodes before subscribing. When your recommendation profile is ready, the <strong>Top Picks</strong> banner surfaces episodes from the current search or chart collection.</p><p>For a show outside the directory, use <strong>manual RSS entry</strong> with its feed URL. The PodHaven share extension can also open supported podcast links and feeds sent from other apps.</p>`,
        screenshots: ['discovery', 'search-picks']
      },
      {
        id: 'browse', title: 'Your collection, easy to navigate.',
        body: `<p>Browse subscribed podcasts in a grid or a list, sort them, and filter by tags. Show details bring artwork, descriptions, episode lists, and per-podcast settings together. Select several shows to subscribe, unsubscribe, tag, or delete them together.</p><p>Search within a subscribed podcast’s episode titles and descriptions. For collections across shows, build a <a href="/podhaven/smart-lists">Smart List</a> with text, state, tag, duration, or date conditions.</p>`,
        screenshots: ['library']
      },
      {
        id: 'opml', title: 'Bring your subscriptions. Take them with you.',
        body: `<p><strong>OPML</strong> is a file format for a list of podcast feeds. If your previous app exports OPML, import that file in <strong>Settings → Importing / Exporting → OPML</strong>.</p><p>Review the import’s waiting, downloading, finished, and failed items. Export your subscriptions from the same screen whenever you need a portable copy.</p><p>Share a podcast or episode with a link. Friends can open its web page without PodHaven, and use <strong>Open in PodHaven</strong> if they have the app. While an episode is playing, choose to share from the beginning or from the current playback time.</p>`,
        screenshots: ['timed-share']
      }
    ]
  },
  offline: {
    label: 'Offline listening',
    title: 'Good company. Even without a connection.',
    description: 'Download episodes, protect favorites with Save in Cache, and set automatic downloads and a storage budget.',
    intro: 'Get your next listen ready before you leave. Download the episodes you need, keep the ones you love, and give temporary downloads a sensible budget.',
    guide: 'offline-storage',
    sections: [
      {
        id: 'download', title: 'Ready when the signal is not.',
        body: `<p>Download an episode from its detail page or context menu, or select several episodes to cache together. Download state and progress help you check that audio is ready before you go offline.</p><p>A stored transcript can be read without a connection too. Creating an on-device transcript first requires the speech model and local episode audio.</p>`,
        screenshots: ['offline']
      },
      {
        id: 'storage', title: 'Keep a cache. Keep your favorites.',
        body: `<dl><dt>Cache</dt><dd>A downloaded copy for offline listening. It can be removed automatically when space is needed.</dd><dt>Save in Cache</dt><dd>Protects an episode’s audio from automatic cache cleanup.</dd><dt>Cache Size Limit</dt><dd>A 0.5–20 GB budget for managed downloads. The oldest eligible unsaved downloads are removed first.</dd></dl><p>Saved audio is protected from automatic eviction, so the configured cache budget is not a hard limit on all storage used by the app. Save selectively and remove downloads you no longer need.</p>`,
        screenshots: []
      },
      {
        id: 'automatic', title: 'Let your regular shows get ready for you.',
        body: `<p>In a podcast’s settings, choose <strong>Cache All Episodes → Cache</strong> to download newly discovered episodes, or <strong>Save</strong> to protect those downloads too. Choose <strong>Never</strong> for manual downloads.</p><p>Background feed refresh can discover new episodes and start configured work. iOS controls background scheduling, so open and refresh PodHaven before a trip, then confirm the downloads have finished.</p>`,
        screenshots: ['podcast-settings']
      }
    ]
  },
  transcripts: {
    label: 'Transcripts',
    title: 'Listen to the conversation. Read it, too.',
    description: 'Read publisher transcripts or create them on device. Follow along in the player, manage transcription work, and find phrases with Smart Lists.',
    intro: 'Catch the words you missed. Revisit an idea. Follow the conversation as it plays. PodHaven brings transcripts into your everyday listening.',
    guide: 'transcripts',
    sections: [
      {
        id: 'read', title: 'The words, right beside the episode.',
        body: `<p>Open an episode and switch from <strong>Description</strong> to <strong>Transcription</strong> to read its transcript. The source label tells you whether it came from the <strong>Podcast feed</strong> or was created <strong>On device</strong>.</p><p>For episodes with a stored transcript, expand the player and choose <strong>Show Transcript</strong>. The current text block is highlighted and scrolls with playback, while your playback controls remain within reach.</p>`,
        screenshots: ['transcript-reader', 'transcript-player']
      },
      {
        id: 'sources', title: 'Use the show’s transcript. Or create your own.',
        body: `<p>PodHaven can import supported timed transcripts supplied through a podcast’s feed. When you request a transcript, it tries a suitable publisher version before processing the audio on device.</p><p>On supported devices, Apple’s speech recognition creates transcripts locally from downloaded audio. The current on-device transcription language is <strong>English (US)</strong>. The speech model and episode audio may need to download first.</p><p>If you want a local version of a publisher transcript, choose <strong>Replace with On-Device Transcription</strong>. The publisher text remains readable while the replacement is in progress and is replaced only after the new transcript succeeds.</p>`,
        screenshots: []
      },
      {
        id: 'queue', title: 'A queue for the reading ahead.',
        body: `<p>Request transcription from episode details, the player, context menus, or a batch of selected episodes. In <strong>Settings → Transcription → Transcription Queue</strong>, see the active episode and the waiting list.</p><p>Drag waiting episodes into order, move them to the top or bottom, remove them, or use <strong>Transcribe Now</strong> to give one priority. Pause and resume without losing saved progress. Use <strong>Discard Progress</strong> when you want a fresh start.</p><p>Choose a queue limit from 10–100 episodes. Transcription can continue in the background when iOS permits it. Saved checkpoints let interrupted work resume; keeping PodHaven open lets foreground processing continue.</p>`,
        screenshots: []
      },
      {
        id: 'automatic', title: 'Give your regular shows a reading routine.',
        body: `<p>Enable <strong>Transcribe New Episodes</strong> in a podcast’s settings to queue episodes discovered during later refreshes. It does not transcribe the existing back catalog or the episodes imported when you first subscribe.</p><p>Automatic requests share the transcription queue’s limit. Enable this for selected shows so the queue has room; requests rejected because the queue is full are not automatically retried.</p><p>Use <a href="/podhaven/smart-lists">Smart Lists</a> to collect transcribed episodes or find an exact phrase in stored transcript text. This filtering works across transcripts already in your library.</p>`,
        screenshots: []
      }
    ]
  }
}
