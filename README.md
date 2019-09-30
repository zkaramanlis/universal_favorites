# Universal Favorites

A chrome extension that provides a favorites system similar to a normal browsers, but independent of any particular browser implementation! Easily sync favorites between any browser that accepts chrome extensions (Firefox coming soon) in real time.



![Example](.\Example.PNG)



Other universal bookmarking systems like pocket or Instapaper either have lackluster extensions that only allow you to add a bookmark, have experiences that are mainly tailored for articles instead of general bookmarks, or do not allow extensive folder structures and instead require "labels" that you have to search for.



This extension provides the same experience you are used to with you browsers bookmarks, and more!

## Features

- **Unlimited Folder Structure**
- **Synch Through Google Drive**
- **Free**
- **Searching**
- **Instantly grabs website favicons**



## FAQ

- **Why google drive?** - cloud storage services was chosen as the medium to sync for 3 main reasons

  1. <u>To Keep It Free</u>: maintaining a server to synch the browsers would mean I would have to come up with some way monetize the extension to keep up with the costs. Not only is it much harder to monetize an extension, this just isn't something I want to charge people for
  2. <u>Security and Controllability</u>: While the file is still in the cloud, drive is still a secure medium to store it that keeps it away from prying eyes while still keeping it under your control. Want to delete your favorites? just delete the file.
  3. <u>It's what I use</u>: This was built because it is something I though I could use, and thus something I thought others might be able to use as well. If this becomes popular enough I might consider expanding it to other cloud storage mediums.

- **How does it work?** - go to the settings menu and click on 'authorize access'. Once you go through Google's menu's you should get a code. Put this in the extension and click submit. If the file already exists in you favorites it will load them. Otherwise it will create a new file from you existing extensions

  Click on the plus sign to add a favorite, and right click on a link or folder to add or delete.

- **What about firefox and edge?** - Edge will soon become chromium based and will support chrome extensions. Firefox is in the works.

- **What will you touch in my drive, and how much space will you use?** - The extension will create and update a file called 'FavoritesBar_SyncFile.json'. The access I requested only allows the extension to touch files created by me, so I couldn't do anything even if I wanted to. The file is very small, and will add virtually nothing to your storage space. A few KBs at most.

