module.exports = {
  'getting-started': {
    label: 'Getting started', title: 'Your first good listen.',
    description: 'Add your shows, choose an episode, set playback preferences, and discover PodHaven’s on-device recommendations, Smart Lists, filters, and customization.',
    intro: 'Start with a few shows you enjoy. You can shape the rest of PodHaven around your listening as you go.',
    sections: [
      {
        id: 'shows', title: '1. Bring in a few shows.',
        body: `<p>Open <strong>Search</strong>, enter a show name or browse a chart, and open a result to subscribe. Use manual feed entry if you already have an RSS URL.</p><p>Moving from another app that exports OPML? Open <strong>Settings → Importing / Exporting → OPML → Import OPML</strong>, choose your file, and review the import results. OPML transfers a subscription list; it is not a full backup of listening progress, ratings, or downloads.</p>`,
        screenshots: ['discovery']
      },
      {
        id: 'play', title: '2. Pick an episode and make yourself comfortable.',
        body: `<p>Play an episode from its detail page, or use its queue actions to add it to the top or bottom of Up Next. Expand the Play Bar to adjust speed and use the main playback controls.</p><p>In <strong>Settings → Playback</strong>, choose your default speed, forward and backward skip intervals, and whether to enable Undo Seek. A podcast’s settings can override the default speed for that show.</p><p>Download a few episodes before you need them offline. Use Save in Cache for audio you want protected from automatic cleanup.</p>`,
        screenshots: ['player']
      },
      {
        id: 'personal', title: '3. Give PodHaven a sense of your taste.',
        body: `<p>Rate a few familiar episodes with Love or Like. Dislike is useful when you want fewer similar recommendations; Not Interested simply hides one episode.</p><p>Recommendations need at least three qualifying rated or listened episodes and ready content models. They may take time to appear while models and episode information are processed. You can then explore picks below Up Next and in Search.</p>`,
        screenshots: ['recommendation-detail']
      },
      {
        id: 'next', title: '4. Make your library and settings your own.',
        body: `<p>In <strong>Episodes</strong>, tap <strong>+</strong> to create a Smart List. Start with unfinished episodes under 30 minutes. <a href="/podhaven/guides/smart-lists">Build your first Smart List</a> for a complete example.</p><p>Open <a href="/podhaven/guides/settings">Settings</a> to choose your gestures, artwork, and recommendation preferences. Use <a href="/podhaven/guides/per-podcast-settings">Podcast Settings</a> to give each show its own playback, automatic queueing, downloads, and notifications.</p><p>When you want to read along, the <a href="/podhaven/guides/transcripts">transcript guide</a> explains how to get and use an episode transcript.</p>`,
        screenshots: ['smart-lists']
      }
    ]
  },
  'training-recommendations': {
    label: 'Better recommendations', title: 'Teach PodHaven what you enjoy.',
    description: 'Understand ratings, listening signals, recommendation scores, discovery settings, and how to improve your picks.',
    intro: 'You do not need to rate everything. A few clear preferences give the engine a useful starting point.',
    sections: [
      {
        id: 'start', title: 'Start with clear feedback.',
        body: `<ol><li>Find episodes you already know well.</li><li>Use <strong>Love</strong> for favorites and <strong>Like</strong> for episodes you enjoyed.</li><li>Use <strong>Dislike</strong> when you want the model to move away from similar content.</li><li>Use <strong>Not Interested</strong> to remove an individual recommendation without teaching a negative preference.</li></ol><p>Open the rating menu on episode details, in the player, or in a context menu. Select a different rating or clear it when your opinion changes.</p><p>The engine needs at least three qualifying signal episodes. Content models must also be ready, so a new library can need time before recommendations appear.</p>`,
        screenshots: ['recommendation-detail']
      },
      {
        id: 'listening', title: 'Listening helps, even without a rating.',
        body: `<p>PodHaven records which parts of an episode you actually hear. A listen must cover at least one minute and 10% of the episode to qualify as an implicit signal.</p><p>Qualifying listening contributes positive interest in proportion to coverage. A brief sample below those thresholds contributes no listening signal. Stopping early never creates a negative signal. Use Dislike when you want to express that.</p><p>Explicit ratings take precedence for that episode. Marking an episode finished or scrubbing to the end does not count as hearing the missing audio.</p>`,
        screenshots: []
      },
      {
        id: 'tune', title: 'Adjust how familiar the picks feel.',
        body: `<p>Open <strong>Settings → Recommendations</strong>.</p><ul><li><strong>Focused:</strong> keeps recommendations closer to shows you have already rated.</li><li><strong>Exploratory:</strong> the default; helps surface related topics across different podcast formats.</li><li><strong>Podcast Affinity:</strong> increase it to give a show’s rating history more weight, or lower it to favor episode content. The range is 0–50%.</li></ul><p>Open a podcast’s settings to adjust <strong>Freshness</strong>. Auto detects its publishing cadence. Hourly, Twice Daily, Daily, Twice Weekly, Weekly, and Monthly apply progressively slower age penalties. Evergreen removes the age penalty.</p><p>Freshness changes how age affects a score. Use ratings and affinity to change how much the engine favors a show or subject.</p>`,
        screenshots: ['recommendation-settings', 'podcast-settings-lower']
      },
      {
        id: 'find', title: 'Use recommendations across the app.',
        body: `<p>In <strong>Settings → Up Next</strong>, choose how many Recommended Episodes to show, from Off to 20. Enable Auto-play Recommendation if you want the top available pick to follow an empty queue.</p><p>Search a topic or browse a chart, then open its <strong>Top Picks</strong> banner once ready. You can also use Recommendation sorting in supported episode lists.</p><p>A displayed score is a relative ranking, not a predicted percentage chance of enjoyment. Reason chips show which factors supported the recommendation.</p><p>If picks are missing, check your Up Next recommendation count, rate a few more episodes, and allow time for content processing while the app is open. Already started, finished, queued, or rated episodes are excluded from the normal recommendation candidate pool.</p>`,
        screenshots: ['search-picks']
      }
    ]
  },
  'smart-lists': {
    label: 'Smart Lists & tags', title: 'Build a collection that keeps itself current.',
    description: 'Create Smart Lists with All/Any conditions, text and transcript filters, tags, duration limits, sorting, and unread badges.',
    intro: 'Start with a simple rule, then combine conditions when your listening needs something more specific.',
    sections: [
      {
        id: 'create', title: 'Make a “Short & Fresh” list.',
        body: `<ol><li>Open <strong>Episodes</strong> and tap <strong>+</strong>.</li><li>Name the list <strong>Short &amp; Fresh</strong> and choose an icon.</li><li>Set Match to <strong>All</strong>.</li><li>Add <strong>State → Unfinished</strong>.</li><li>Add <strong>Duration</strong>, leave the minimum empty, and set the maximum to 30 minutes.</li><li>Add <strong>Publish Date → within last → 7 days</strong>.</li><li>Save, open the list, and choose a sort order.</li></ol><p>The list updates as matching episodes arrive or you finish them. A list with no conditions matches every episode.</p>`,
        screenshots: ['smart-list-editor', 'smart-lists']
      },
      {
        id: 'groups', title: 'Combine All and Any.',
        body: `<p><strong>All</strong> requires every condition to match. <strong>Any</strong> requires at least one. Groups let you combine these choices.</p><p>For a favorites list you have not finished, put <strong>Unfinished</strong> at the top with Match All. Add a group with Match Any containing <strong>Liked</strong> and <strong>Loved</strong>.</p><p>Other useful recipes:</p><ul><li><strong>Offline next:</strong> All of Cached, Unfinished, and Unqueued.</li><li><strong>Worth another listen:</strong> All of Finished and the tag Revisit.</li><li><strong>Reading queue:</strong> All of Transcribed and Unfinished.</li><li><strong>Back catalog:</strong> All of Unstarted and a Publish Date older than your chosen number of days.</li></ul>`,
        screenshots: []
      },
      {
        id: 'tags', title: 'Organize at the show or episode level.',
        body: `<p>Create a tag in <strong>Settings → Organization → Tags</strong>, choose its name and icon, then apply it from a podcast or episode’s tag menu. Selection mode lets you tag several items together.</p><p>A Smart List tag condition matches either an episode’s own tag or a tag on its podcast. Use a show-level tag for a broad subject and episode tags for specific follow-ups.</p><p>The tag manager supports editing and removal. Deleting a tag also removes filter conditions that refer to it, which can broaden the affected Smart Lists. Review the deletion message before confirming.</p>`,
        screenshots: ['podcast-tags', 'tag-manager']
      },
      {
        id: 'transcripts', title: 'Find a phrase in what was said.',
        body: `<p>Add <strong>Episode Transcription → contains</strong>, then enter a phrase such as “climate change.” Text conditions match words together as a phrase. They are not general topic or semantic searches.</p><p>The filter uses transcripts already stored in your library. It does not start transcription. Use <strong>State → Transcribed</strong> with an exclusion condition if you want only transcripts that do not contain a phrase; otherwise episodes without transcripts can also meet that exclusion.</p><p>For ordinary episode and podcast text, choose Title, Description, or Title or Description. These use phrase matching too.</p>`,
        screenshots: []
      },
      {
        id: 'presentation', title: 'Choose how each list feels.',
        body: `<p>Pick a custom icon and turn <strong>Show Unread Badge</strong> on or off. The badge tracks newly added matching episodes since your last visit, separately from listening progress.</p><p>Use <strong>Always Show Podcast Art</strong> for consistent artwork. Sort by newest, oldest, recently added, duration, recently finished, recently queued, or Recommendation. The choice is saved per list.</p><p>Reorder Smart Lists in Episodes. Swipe to edit or delete a list. Deleting the list removes its rules, not the episodes in your library.</p>`,
        screenshots: []
      }
    ]
  },
  settings: {
    label: 'Settings reference', title: 'Every everyday setting, explained.',
    description: 'A reference for PodHaven’s organization, transcription, gestures, playback, appearance, recommendations, queue, storage, and feedback settings.',
    intro: 'Use this page when you know the result you want but are not sure which control to change. Options that require device support appear only when available.',
    sections: [
      {
        id: 'library', title: 'Importing, exporting, and organization.',
        body: `<dl><dt>Importing / Exporting → OPML</dt><dd>Import or export a file containing your podcast subscriptions.</dd><dt>Organization → Tags</dt><dd>Create, rename, and delete tags; choose their icons and review usage.</dd></dl><p>Smart Lists are created and edited from the Episodes tab, rather than this Settings page.</p>`,
        screenshots: ['tag-manager']
      },
      {
        id: 'transcription', title: 'Transcription.',
        body: `<dl><dt>Transcription Queue</dt><dd>See active work and reorder, prioritize, or remove waiting episodes.</dd><dt>Max Queue Length</dt><dd>10–100 episodes including active work. Lowering the limit keeps existing requests.</dd></dl><p>These controls appear on supported devices. Per-show automatic transcription is in Podcast Settings. <a href="/podhaven/guides/transcripts">Read the transcription guide</a>.</p>`,
        screenshots: []
      },
      {
        id: 'gestures', title: 'Gestures.',
        body: `<p><strong>Swipe Left Actions</strong> lets you choose up to three episode actions, reorder them, and see a preview. The first action runs on a full swipe. Right-swipe queue actions stay fixed.</p>`,
        screenshots: ['swipe-settings']
      },
      {
        id: 'playback', title: 'Playback.',
        body: `<dl><dt>Shorten Silence</dt><dd>Gentle, Balanced, or Aggressive shortens clear pauses in downloaded, analyzed audio. Off, the default, keeps the original pauses.</dd><dt>Quiet Audio Protection</dt><dd>High, the default, protects fainter sounds. Medium and Low allow more background noise within a pause, but may skip quiet speech. This setting does not enable skipping when Shorten Silence is Off.</dd><dt>Default Playback Rate</dt><dd>0.8×–2.0×, in 0.1× steps, for first playback of new episodes.</dd><dt>Next Track Behavior</dt><dd>Next Episode, Skip Interval, or Next Chapter. Chapter mode falls back to skips if chapters are unavailable.</dd><dt>Skip Forward / Backward Interval</dt><dd>Set each independently to 5, 10, 15, 30, 45, 60, 75, or 90 seconds.</dd><dt>Enable Undo Seek</dt><dd>Offers a return to the previous position after a progress-bar seek.</dd><dt>Command Center Scrubbing</dt><dd>Allows progress-bar seeks through system playback controls. Turn it off to prevent accidental remote seeks.</dd><dt>Like Button</dt><dd>Love, Like, Save in Cache, or Add Tag, where supported remotes expose this command.</dd><dt>Dislike Button</dt><dd>Dislike or Add Tag. Create tags first to use a tag assignment.</dd></dl><p>Follow the <a href="/podhaven/guides/listening-tactics#silence-skipping">silence skipping guide</a> to choose settings for a show or the current playback.</p>`,
        screenshots: ['remote-settings']
      },
      {
        id: 'appearance', title: 'Appearance.',
        body: `<dl><dt>Appearance Mode</dt><dd>System follows the device; Light and Dark override it.</dd><dt>Shrink Playbar</dt><dd>Reduces the Play Bar while scrolling down and restores it when scrolling back.</dd><dt>Show Time Remaining</dt><dd>Shows remaining time instead of total duration for started episodes in lists.</dd></dl>`,
        screenshots: ['light-mode']
      },
      {
        id: 'recommendations', title: 'Recommendations.',
        body: `<dl><dt>Recommendation Diversity</dt><dd>Focused stays closer to rated shows. Exploratory, the default, encourages discovery across show formats.</dd><dt>Podcast Affinity</dt><dd>0–50% weighting for a show’s rating history versus episode content. Default: 10%.</dd></dl><p>Freshness is set per podcast. <a href="/podhaven/guides/training-recommendations">Learn how recommendations use these choices</a>.</p>`,
        screenshots: ['recommendation-settings']
      },
      {
        id: 'up-next', title: 'Up Next.',
        body: `<dl><dt>Show Now Playing</dt><dd>Shows the current episode at the top of Up Next.</dd><dt>Always Show Podcast Art</dt><dd>Separate choices for the queue, recommendations, and Now Playing. Now Playing artwork also affects the Play Bar, Lock Screen, and Now Playing widget.</dd><dt>Max Queue Length</dt><dd>10–100 episodes. Top additions can displace entries at the end; bottom additions stop when full.</dd><dt>Recommended Episodes</dt><dd>Off or up to 20 recommendations beneath the queue.</dd><dt>Auto-play Recommendation</dt><dd>Continues with the top available recommendation after an episode ends with an empty queue.</dd></dl>`,
        screenshots: ['up-next']
      },
      {
        id: 'storage', title: 'Storage and feedback.',
        body: `<p><strong>Storage → Cache Size Limit</strong> sets a budget from 0.5–20 GB. Saved audio is protected from automatic cleanup, so it can take usage beyond that budget.</p><p><strong>Send Feedback</strong> is available in release builds. The Settings menu also links to the website, Discord, and GitHub. Development and testing builds can show additional diagnostic controls.</p><p>For options that apply to one show, use the <a href="/podhaven/guides/per-podcast-settings">per-podcast settings reference</a>.</p>`,
        screenshots: []
      }
    ]
  },
  'per-podcast-settings': {
    label: 'Per-podcast settings', title: 'Give every show its own routine.',
    description: 'Set playback speed, silence skipping, automatic queueing and limits, downloads, transcription, freshness, and notifications for an individual podcast.',
    intro: 'Open a subscribed podcast’s detail page and its settings control. These options let a daily briefing behave differently from a long-running interview series.',
    sections: [
      {
        id: 'playback', title: 'Playback and queueing.',
        body: `<dl><dt>Shorten Silence</dt><dd>Choose Gentle, Balanced, Aggressive, or Off for this show. Use Global follows your default setting.</dd><dt>Quiet Audio Protection</dt><dd>Choose High, Medium, or Low independently of the silence mode. Use Global follows your default protection level.</dd><dt>Playback Rate</dt><dd>Overrides the global default for new episodes from this show. Clear the override to follow the global rate again.</dd><dt>Queue All Episodes</dt><dd>Never leaves queueing manual. On Bottom appends newly discovered episodes; On Top puts them first.</dd><dt>Limit Episodes</dt><dd>Available when automatic queueing is enabled. Keeps the chosen number of latest episodes from this podcast as new ones are auto-queued.</dd></dl><p>Silence skipping requires downloaded audio and completed analysis. A temporary choice in the expanded player takes precedence over the matching podcast setting for the current playback. <a href="/podhaven/guides/listening-tactics#silence-skipping">Learn how silence settings work together</a>.</p><p>A useful daily-news setup is On Top with a small episode limit. For a slower series, On Bottom leaves your current listening plan ahead of it.</p>`,
        screenshots: ['podcast-settings']
      },
      {
        id: 'storage', title: 'Downloads and transcripts.',
        body: `<dl><dt>Cache All Episodes → Never</dt><dd>Download audio manually.</dd><dt>Cache All Episodes → Cache</dt><dd>Download new episodes, with normal automatic cache cleanup.</dd><dt>Cache All Episodes → Save</dt><dd>Download new episodes and protect them from automatic cleanup.</dd><dt>Transcribe New Episodes</dt><dd>On supported devices, automatically queue episodes discovered during later refreshes for transcription.</dd></dl><p>Automatic transcription does not backfill existing episodes or the initial subscription import. A full transcription queue can reject new automatic work without retrying it. Enable the option for a manageable set of shows.</p>`,
        screenshots: []
      },
      {
        id: 'freshness', title: 'Freshness and notifications.',
        body: `<p><strong>Freshness → Auto</strong> infers the publishing cadence and shows the resolved choice. Manual choices are Hourly, Twice Daily, Daily, Twice Weekly, Weekly, Monthly, and Evergreen.</p><p>Faster cadences reduce the recommendation scores of older episodes sooner. Evergreen removes the age penalty. It does not make a show more interesting to the model; ratings and Podcast Affinity control that part.</p><p><strong>Notify New Episodes</strong> enables alerts for this show. If notification access is missing or denied, use the permission or system-settings action shown beneath it. Discovery and delivery depend on feed refresh and iOS background scheduling.</p>`,
        screenshots: ['podcast-settings-lower']
      }
    ]
  },
  'listening-tactics': {
    label: 'Player, queue & gestures', title: 'Make everyday listening easier.',
    description: 'Use silence skipping, CarPlay, Up Next, batch actions, configurable swipes, playback shortcuts, chapters, and remote controls.',
    intro: 'A few useful shortcuts for arranging episodes and staying in control while you listen.',
    sections: [
      {
        id: 'queue', title: 'Build and maintain Up Next.',
        body: `<p>Long-press an episode to find its queue menu, or use the right-swipe queue actions. Add it at the top for an immediate follow-up, or at the bottom for later. Drag queued episodes into order.</p><p>Set <strong>Settings → Up Next → Max Queue Length</strong> to 10–100. At capacity, adding to the top removes items from the end; adding to the bottom uses only the available room.</p><p>For a daily show, open Podcast Settings and enable <strong>Queue All Episodes</strong>, then <strong>Limit Episodes</strong>. The cap removes older entries from that show as new episodes are auto-queued.</p>`,
        screenshots: ['up-next']
      },
      {
        id: 'gestures', title: 'Choose the actions you reach for.',
        body: `<ol><li>Open <strong>Settings → Gestures → Swipe Left Actions</strong>.</li><li>Choose up to three actions.</li><li>Drag to put them in order.</li><li>Check the preview: the first action appears at the far right and runs on a full swipe.</li></ol><p>Available choices include Play/Pause, Rate, Mark Finished, Cache, Save in Cache, Tag, and Transcribe on supported devices. Right-swipe queue actions are fixed.</p><p>Enter selection mode in an episode list to work on several items at once. Use Replace Queue to make the selected episodes your new listening plan. Available actions depend on the list and the selected episodes’ state.</p>`,
        screenshots: ['swipe-settings', 'batch-actions']
      },
      {
        id: 'player', title: 'Move around without losing your place.',
        body: `<p>Enable <strong>Undo Seek</strong> to return after an accidental progress-bar move. After going back, the furthest-position control can return you to the furthest point you have played.</p><p>Use chapter controls when the episode has embedded chapters. Tap recognized timestamps in the description to jump to a referenced moment. Use <strong>Show Transcript</strong> in the expanded player to follow stored text alongside playback.</p><p>Adjust playback speed for the episode, or set a default in global or per-podcast settings. The supported range is 0.8×–2.0×.</p>`,
        screenshots: ['chapter-player']
      },
      {
        id: 'silence-skipping', title: 'Shorten pauses with silence skipping.',
        body: `<ol><li>Download the episode you want to hear.</li><li>Open <strong>Settings → Playback → Shorten Silence</strong>.</li><li>Choose <strong>Gentle</strong> to keep more space, <strong>Balanced</strong> to shorten more, or <strong>Aggressive</strong> to remove the most. <strong>Off</strong> keeps the original pauses.</li><li>Let PodHaven finish analyzing the audio. Playback continues normally while analysis is pending.</li></ol><p><strong>Quiet Audio Protection</strong> controls how quiet a pause must be before it can be skipped. <strong>High</strong>, the default, protects fainter sounds. <strong>Medium</strong> and <strong>Low</strong> allow more background noise, but may skip quiet speech. Protection does not turn silence skipping on by itself.</p><p>For a particular show, open Podcast Settings and choose its silence mode and protection level. Each can follow <strong>Use Global</strong> or have its own override.</p><p>For a temporary change, expand the player and use <strong>Shorten Silence</strong> and <strong>Quiet Audio Protection</strong> beside the speed control. Each player choice overrides only that setting for the current playback. It survives pausing and seeking, then clears when playback ends or another episode is selected. It does not change your saved defaults.</p><p>Higher playback speeds shorten pauses a little more automatically. Choose Off at any time to stop automatic silence skips.</p>`,
        screenshots: []
      },
      {
        id: 'carplay', title: 'Listen with CarPlay.',
        body: `<ol><li>Before your trip, organize your queue and download any episodes you need offline.</li><li>Connect your iPhone to a CarPlay-compatible vehicle and open PodHaven on its display.</li><li>Choose an episode from <strong>Up Next</strong>, <strong>Episodes</strong>, or <strong>Podcasts</strong>.</li></ol><dl><dt>Up Next</dt><dd>Browse your current episode, queue, and available recommendations.</dd><dt>Episodes</dt><dd>Open your saved Smart Lists in their configured order.</dd><dt>Podcasts</dt><dd>Browse Recently Updated shows or All Podcasts. A show opens with unfinished episodes; choose All Episodes to include finished ones.</dd></dl><p>Use <strong>Now Playing</strong> to pause, skip, change playback speed, or return to Up Next. CarPlay shares your iPhone’s player and queue. Your configured skip intervals and Next Track behavior still apply.</p><p>Vehicle restrictions can limit how many items are available to browse. Downloads must be complete before you rely on offline playback.</p>`,
        screenshots: []
      },
      {
        id: 'remote', title: 'Set the behavior of external controls.',
        body: `<p>In <strong>Settings → Playback</strong>, choose <strong>Next Track Behavior</strong>: Next Episode, Skip Interval, or Next Chapter. Chapters fall back to the interval when unavailable.</p><p>Turn off <strong>Command Center Scrubbing</strong> to prevent remote progress-bar seeks while keeping skips and progress display available.</p><p>Set <strong>Like Button</strong> to Love, Like, Save in Cache, or Add Tag. Set <strong>Dislike Button</strong> to Dislike or Add Tag. Tag choices appear after you create tags. These settings apply when connected controls expose those commands.</p>`,
        screenshots: ['remote-settings']
      }
    ]
  },
  'offline-storage': {
    label: 'Offline & storage', title: 'Get ready before you go.',
    description: 'Understand Cache and Save in Cache, download episodes before a trip, manage storage, and prepare transcripts for offline reading.',
    intro: 'A quick preparation routine for flights, commutes, and anywhere a connection is uncertain.',
    sections: [
      {
        id: 'prepare', title: 'Prepare a small offline collection.',
        body: `<ol><li>Queue the episodes you want, or make a Smart List for the trip.</li><li>Select them and choose the cache/download action.</li><li>Wait for download completion; a waiting or in-progress download is not ready yet.</li><li>Use <strong>Save in Cache</strong> for episodes that must survive automatic cleanup.</li><li>If you want to read too, request transcripts and confirm they are complete before leaving.</li></ol><p>Open a downloaded episode and check playback before you depend on it offline.</p>`,
        screenshots: ['offline', 'batch-actions']
      },
      {
        id: 'budget', title: 'Choose a budget and protect selectively.',
        body: `<p>Open <strong>Settings → Storage → Cache Size Limit</strong> and choose from 0.5–20 GB. PodHaven removes the oldest eligible unsaved downloads when it needs room.</p><p><strong>Save in Cache</strong> protects audio from this automatic cleanup. The budget therefore is not a hard ceiling on total app storage. A large saved collection can use more space.</p><p>Use the episode’s cache menu to remove audio or remove its saved protection when you no longer need it. Smart List conditions for Cached and Saved help you review your collection.</p>`,
        screenshots: []
      },
      {
        id: 'automatic', title: 'Automate the shows you always take along.',
        body: `<p>In Podcast Settings, set <strong>Cache All Episodes</strong> to Cache or Save. This applies to newly discovered episodes. Use manual selection for older episodes you want now.</p><p>Background work follows iOS scheduling. Before leaving, open PodHaven, refresh your feeds, and check download completion instead of assuming every new episode is already cached.</p><p>Removing audio does not itself erase a finished transcript. If local transcription needs that audio later, it may download it again. The actively transcribing episode is protected while processing, but waiting queue entries can need another download.</p>`,
        screenshots: ['podcast-settings']
      }
    ]
  },
  'sharing-and-widgets': {
    label: 'Sharing, widgets & notifications', title: 'Keep PodHaven close.',
    description: 'Share podcasts and episodes, use the share extension, add Home and Lock Screen widgets, and configure Control Center and notifications.',
    intro: 'Share a discovery with a friend, or make your next episode easier to reach from outside the app.',
    sections: [
      {
        id: 'share', title: 'Send a show or an episode.',
        body: `<p>Use Share on a podcast or episode. The link opens a page on artisanalsoftware.com, where a friend can read the details and use Open in PodHaven if the app is installed. Episode pages also offer an audio player.</p><p>When the current episode has played past the beginning, its Share menu offers the full episode or <strong>Share from</strong> the current time. Use the timed link to point a friend to a particular passage.</p><p>To bring a supported podcast link or feed into PodHaven, open another app’s share sheet and choose PodHaven. If the extension is hidden, add it through the share sheet’s app list. A feed URL can also be entered manually in Search. Sharing an OPML file to PodHaven opens its subscription import flow.</p>`,
        screenshots: ['timed-share']
      },
      {
        id: 'home', title: 'Choose a Home Screen widget.',
        body: `<p>Open the Home Screen widget gallery and search for PodHaven. Choose <strong>Now Playing</strong>, <strong>Up Next</strong>, or <strong>Now Playing &amp; Up Next</strong>, then pick an available size.</p><p>Use the playback controls or episode links available in that layout. Queue widgets give you a view of upcoming listening; the combined widget keeps current and upcoming episodes together.</p>`,
        screenshots: ['widgets']
      },
      {
        id: 'lock', title: 'Add Lock Screen and Control Center access.',
        body: `<p>Use the Lock Screen’s system Now Playing controls to pause, skip, and change output. While customizing the Lock Screen, you can also add PodHaven’s <strong>Now Playing</strong> widget: choose compact play/pause controls or a rectangular widget with episode details.</p><p>In Control Center’s control gallery, add PodHaven <strong>Play/Pause</strong>, <strong>Skip Backward</strong>, and <strong>Skip Forward</strong>. Skip controls use your configured intervals.</p><p>System Now Playing also works with compatible external controls. See <a href="/podhaven/guides/listening-tactics#remote">remote control settings</a> for Next Track, scrubbing, and Like/Dislike behavior.</p>`,
        screenshots: ['lock-screen']
      },
      {
        id: 'alerts', title: 'Choose which shows can notify you.',
        body: `<p>Open Podcast Settings and enable <strong>Notify New Episodes</strong>. Allow notifications when prompted, or follow the system-settings link if access was denied.</p><p>Notifications can include artwork and a direct link to the episode. They are triggered by newly discovered episodes during refresh, so they are not a guarantee of an alert at the exact publishing time.</p><p>Report problems through <strong>Settings → Send Feedback</strong> in release builds. Feedback can include diagnostic information to help investigate the issue.</p>`,
        screenshots: []
      }
    ]
  },
  transcripts: {
    label: 'Read & manage transcripts', title: 'From spoken words to a useful transcript.',
    description: 'Get a transcript, follow playback, manage the transcription queue, resume work, and find phrases in stored transcripts.',
    intro: 'Use a transcript supplied by the show or create one on your device. Here is how to read it and manage the work behind it.',
    sections: [
      {
        id: 'get', title: 'Get a transcript.',
        body: `<ol><li>Open an episode’s detail page and choose <strong>Transcription</strong>.</li><li>If a transcript is already available, read it immediately.</li><li>On a supported device, choose <strong>Transcribe</strong> when no transcript is stored.</li><li>PodHaven tries a suitable publisher transcript first. If one is unavailable, it downloads any needed audio and processes it on device.</li></ol><p>On-device transcription currently uses <strong>English (US)</strong> and appears only when the device supports that speech model. Initial model installation and uncached audio need a connection. Publisher transcript availability depends on the feed; supported timed sources include JSON, WebVTT, and SRT.</p><p>Transcripts can contain recognition or publisher errors. They are useful for reading and finding a passage, but check the audio when the exact wording matters.</p>`,
        screenshots: ['transcript-reader']
      },
      {
        id: 'follow', title: 'Follow along during playback.',
        body: `<ol><li>Play an episode with a completed transcript.</li><li>Expand the Play Bar.</li><li>Choose <strong>Show Transcript</strong> or expand the player to its large view.</li></ol><p>The current text block is highlighted and scrolls into view as playback moves. Choose Collapse Transcript to return to the compact player. The episode’s Transcription tab is also available for reading at your own pace.</p>`,
        screenshots: ['transcript-player']
      },
      {
        id: 'queue', title: 'Put important work first.',
        body: `<p>Open <strong>Settings → Transcription → Transcription Queue</strong>. The active episode appears above the waiting list with its progress.</p><ul><li>Drag waiting episodes to reorder them, or use Move to Top / Bottom.</li><li>Use <strong>Transcribe Now</strong> to prioritize an episode. Interrupted work returns to the queue.</li><li>Select several waiting episodes to move or remove them together.</li><li>Choose the maximum queue length in Settings. The range is 10–100 episodes, including active work.</li></ul><p>Lowering the limit preserves existing work. New requests can be added after the queue drains below the limit.</p>`,
        screenshots: []
      },
      {
        id: 'resume', title: 'Pause, resume, or start over.',
        body: `<p><strong>Pause</strong> stops scheduling an episode and preserves saved progress. Removing an episode from the transcription queue also retains its checkpoint. Request it again to resume.</p><p><strong>Discard Progress</strong> deletes partial local work after confirmation. The next on-device attempt starts again. If you are replacing a publisher transcript, that publisher copy remains available.</p><p>If an attempt fails, use <strong>Retry</strong> in episode details. iOS controls background runtime, so processing may stop when the app is not active. Checkpoints survive interruptions and allow later work to continue. Open PodHaven to let foreground processing proceed.</p>`,
        screenshots: []
      },
      {
        id: 'publisher', title: 'Understand the transcript source.',
        body: `<p><strong>Podcast feed</strong> means the text came from a timed transcript published by the show. <strong>On device</strong> means PodHaven created it from audio locally.</p><p>On a compatible device, use <strong>Replace with On-Device Transcription</strong> if you prefer to generate your own copy. You can continue reading the publisher version while the replacement runs. Only a successful local result replaces it.</p><p>Supported publisher transcripts for newly discovered episodes can arrive during feed refresh. Subscribing does not download every historical transcript. Request an older episode’s transcript when you need it.</p>`,
        screenshots: []
      },
      {
        id: 'automatic', title: 'Automate selected shows and find phrases.',
        body: `<p>In Podcast Settings, enable <strong>Transcribe New Episodes</strong> for shows you regularly read. This applies to episodes discovered during later refreshes, not existing episodes or the initial subscription import.</p><p>Automatic work shares your queue limit. If it fills, rejected automatic requests are not retried automatically; queue those episodes manually when space is available.</p><p>To collect matching transcripts, create a Smart List with <strong>Episode Transcription → contains</strong> and a phrase. Add <strong>State → Transcribed</strong> if you want to limit a list explicitly to stored transcripts. <a href="/podhaven/guides/smart-lists#transcripts">See the transcript list recipe</a>.</p>`,
        screenshots: []
      }
    ]
  }
}
