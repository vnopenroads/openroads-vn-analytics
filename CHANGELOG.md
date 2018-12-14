### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

### [v3.0.1]
> 14 December 2018

- Improve Asset detail page layout based on suggestions https://github.com/orma/openroads-vn-analytics/issues/533

### [v3.0.0]
> 19 November 2018

- Bug fixes
- Consolidate IRI and CVTS information per section for visualisation

### [v3.0.0-rc5]
> 08 November 2018

- Release candidate 5
- View sections in the Asset page https://github.com/orma/openroads-vn-analytics/pull/513
- Fix Asset page labels and formatting https://github.com/orma/openroads-vn-analytics/pull/525
- Add CVTS traffic level map https://github.com/orma/openroads-vn-analytics/pull/524
- Fix admin search to support Vietnamese https://github.com/orma/openroads-vn-api/pull/165 

### [v3.0.0-rc4]

> 02 November 2018

- Release candidate 4. Bug fixes https://github.com/orma/openroads-vn-analytics/pull/521

### [v3.0.0-rc3]
> 23 October 2018

- Release candidate 3. Translations https://github.com/orma/openroads-vn-analytics/pull/506

### [v3.0.0-rc2]

> 20 October 2018

- Release candidate 2. Bug fixes https://github.com/orma/openroads-vn-analytics/pull/504

### [v3.0.0-rc]

> 19 October 2018

- Release candidate milestone.

#### [v2.8.0](https://github.com/orma/openroads-vn-analytics/compare/v2.7.2...v2.8.0)

> 19 October 2018

- Get both provinces and districts in tasks search, handle search for districts [`#497`](https://github.com/orma/openroads-vn-analytics/pull/497)
- fetch count correctly for currently selected boundary [`1e2ab8d`](https://github.com/orma/openroads-vn-analytics/commit/1e2ab8d56c4ad0e856c2ff5b5ca72a6e7e1b88c5)

#### [v2.7.1](https://github.com/orma/openroads-vn-analytics/compare/v2.7.0...v2.7.1)

> 18 October 2018

- Fix Editor search bug [`#490`](https://github.com/orma/openroads-vn-analytics/pull/490)

#### [v2.7.0](https://github.com/orma/openroads-vn-analytics/compare/v2.6.2...v2.7.0)

> 17 October 2018

- Search on assets pages [`#482`](https://github.com/orma/openroads-vn-analytics/pull/482)
- Fix stats bug: show province status counts as returned from api, not by summing district counts + add some docs for a function [`d5a36d2`](https://github.com/orma/openroads-vn-analytics/commit/d5a36d2fd02ef396236bcf8549093c66811984c5)
- Fix pagination bug: send page property to MapSearch component from editor page, handle actions appropriately [`0ddfead`](https://github.com/orma/openroads-vn-analytics/commit/0ddfead3209c661180a3d4117a68c9e529be04be)

#### [v2.6.2](https://github.com/orma/openroads-vn-analytics/compare/v2.6.1...v2.6.2)

> 12 October 2018

- Map design changes [`#484`](https://github.com/orma/openroads-vn-analytics/pull/484)
- update changelog [`da6f619`](https://github.com/orma/openroads-vn-analytics/commit/da6f619504f31ceb97c41a0470cc3259db53450c)
- Base map improvements [`#479`](https://github.com/orma/openroads-vn-analytics/pull/479)

#### v2.6.0

> 12 October 2018

- Assets Index and Admin Areas pages [`#471`](https://github.com/orma/openroads-vn-analytics/pull/471)
- asset page stats [`#483`](https://github.com/orma/openroads-vn-analytics/pull/483)

### 2.5.1

> 6 September 2018

- [RLPv2 support](https://github.com/orma/openroads-vn-api/pull/143)

#### [v2.5.0](https://github.com/orma/openroads-vn-analytics/compare/v2.4.0...v2.5.0)

> 5 September 2018

Better statistics for lengths of WON and GPROMM
- migration for adding new length columns [`#132`](https://github.com/orma/openroads-vn-api/pull/132)
- convert to materialized views, do spatial join, update lengths [`#48`](https://github.com/orma/openroads-vn-tiler/pull/48)
- Add navigation to explore map roads https://github.com/orma/openroads-vn-analytics/issues/390

> 29 August 2018

RLP uploads get a better front-end to keep track of progress as well report errors.
- [wip] Upload job status page [`#458`](https://github.com/orma/openroads-vn-analytics/pull/458)
- show banners / status text correctly based on response [`8550895`](https://github.com/orma/openroads-vn-analytics/commit/8550895da35f70d30b31f98e4ecb703cbab3ba5b)
- get copy to clipboard button to work [`406625a`](https://github.com/orma/openroads-vn-analytics/commit/406625a6497f257082e7bd0d1495d9f041b24c15)

#### [v2.4.0](https://github.com/orma/openroads-vn-analytics/compare/v2.3.0...v2.4.0)

> 23 August 2018

New task workflow allows users to skip tasks if it's a wrong detection
- Skip task options [`#461`](https://github.com/orma/openroads-vn-analytics/pull/461)
- implement error / not error states for Skip Task buton [`0bf4851`](https://github.com/orma/openroads-vn-analytics/commit/0bf4851b65eb4328a51c0f139e8ee9e26284a64b)
- update job state on receiveProps [`4be6557`](https://github.com/orma/openroads-vn-analytics/commit/4be6557249f1d6ab8a193f7ecd134a56c065d3a7)

#### [v2.3.0](https://github.com/orma/openroads-vn-analytics/compare/v2.2.0...v2.3.0)

> 22 August 2018

User can go to the Editor for a GPROMM without losing track of the location
- User new ORFrameNotifier [`#454`](https://github.com/orma/openroads-vn-analytics/pull/454)
- Use center of all features [`d303a45`](https://github.com/orma/openroads-vn-analytics/commit/d303a455b842dc5acf482759996cd3d93f4c6db3)
- turfCenter takes a featurecollection [`78cf7dd`](https://github.com/orma/openroads-vn-analytics/commit/78cf7dd2db0b6b7933abb8b00961783e18f6d5fc)

Fixing reported bugs from August 17 training in Tasks and Assets
- bug fixes to tasks and assets [`#453`](https://github.com/orma/openroads-vn-analytics/pull/453)
- Included skip task options UI element [`fe53050`](https://github.com/orma/openroads-vn-analytics/commit/fe53050937dabe5768a4455a14a7018de7d47b26)

Finalise RLP conflation process
- RLP conflation [`#127`](https://github.com/orma/openroads-vn-api/pull/127)
- Feature/rlp refactor [`#125`](https://github.com/orma/openroads-vn-api/pull/125)

#### [v2.2.0](https://github.com/orma/openroads-vn-analytics/compare/v2.1.0...v2.2.0)

> 16 August 2018

Fix bugs reported during training
- Fix blank modal [`#452`](https://github.com/orma/openroads-vn-analytics/pull/452)
- fix bug where panel shows blank post fixing a task [`#451`](https://github.com/orma/openroads-vn-analytics/pull/451)
- fix bug where panel shows blank post fixing a task due to bad order of parameters [`f31cbba`](https://github.com/orma/openroads-vn-analytics/commit/f31cbba5e4d77ea60a008f0e32cb3b0da0358526)
- fix won import [`#121`](https://github.com/orma/openroads-vn-api/pull/121)
- create tasks for at least one way with vprommid. [`#46`](https://github.com/orma/openroads-vn-tiler/pull/46)

Make Tasks less overwhelming
- Persistant tasks [`#45`](https://github.com/orma/openroads-vn-tiler/pull/45)

Implement back-end for new RLP process
- [wip] use bull to perform geometries update as a backgrund job [`89e38cc`](https://github.com/orma/openroads-vn-api/commit/89e38cc059346e47d250b9d7a713f9ff0254e1fe)


### [v2.1.0](https://github.com/orma/openroads-vn-analytics/compare/v3.0.0...v2.1.0)

> 14 August 2018

Tasks are now updated once a day
- Add updated_at to Tasks [`#112`](https://github.com/orma/openroads-vn-api/pull/112)
- return updated_at timestamp in getTask and nextTask endpoints [`149caeb`](https://github.com/orma/openroads-vn-api/commit/149caebb8b40d671c144297bf15c5a0e7b617f46)
- insert task timestamp [`#43`](https://github.com/orma/openroads-vn-tiler/pull/43)
- dedupe task that involves the same way ids [`#41`](https://github.com/orma/openroads-vn-tiler/pull/41)

WON import process and documentation
- WON import [`#111`](https://github.com/orma/openroads-vn-api/pull/111)

New Task workflow
- v2.0.0. New tasks workflow [`#449`](https://github.com/orma/openroads-vn-analytics/pull/449)
- Tasks workflow redesign [`#445`](https://github.com/orma/openroads-vn-analytics/pull/445)

Fix a problem with invalid intersections
- Calculate closest point between two linestrings for non-intersecting ways [`#432`](https://github.com/orma/openroads-vn-analytics/pull/432)


Publish new Asset workflow
- New Assets workflow [`#450`](https://github.com/orma/openroads-vn-analytics/pull/450)
- Asset page [`#441`](https://github.com/orma/openroads-vn-analytics/pull/441)

### v2.0.0
#### openroads-vn-cvts
> June 1 - July 12

Pipeline to handle large CSV data into a traffic map
- Sorting [`#8`](https://github.com/developmentseed/openroads-vn-cvts/pull/8)
- Bashit [`#4`](https://github.com/developmentseed/openroads-vn-cvts/pull/4)
- Stream each line as geojson [`#1`](https://github.com/developmentseed/openroads-vn-cvts/pull/1)
- query pg, stitch sections together. [`26178f6`](https://github.com/developmentseed/openroads-vn-cvts/commit/26178f65f1a2971094ca3e2ab40f6916f5450694)
- refactor traffic-map/map.js to use promises, adds p-fun dependency to package.json [`94fdd0c`](https://github.com/developmentseed/openroads-vn-cvts/commit/94fdd0c428f65365fcbbad25bb948e2501b8d2d3)
- find segments, attach speed, write out [`a947f44`](https://github.com/developmentseed/openroads-vn-cvts/commit/a947f44e97150e5661d97b8618b465dd26945220)

#### v1.3.2

> 12 April 2018

- Bug/clear dedupe vprommid [`#421`](https://github.com/orma/openroads-vn-analytics/pull/421)
- v1.3.1  fix Bim Son Town and Sam Son Town district codes [`#417`](https://github.com/orma/openroads-vn-analytics/pull/417)
- v1.3.0 remove the road from the state when deleted [`#414`](https://github.com/orma/openroads-vn-analytics/pull/414)
- v1.2.0 search admins with space [`#407`](https://github.com/orma/openroads-vn-analytics/pull/407)
- v1.1.0  set viewport to vietnam by default [`#411`](https://github.com/orma/openroads-vn-analytics/pull/411)
- v1.0.0 upgrade mapboxgl. use dasharray style [`#408`](https://github.com/orma/openroads-vn-analytics/pull/408)
- propagate wayslug. fix invalid property [`#405`](https://github.com/orma/openroads-vn-analytics/pull/405)
- explicitly say when there are no tasks instead of just error [`#406`](https://github.com/orma/openroads-vn-analytics/pull/406)
- v0.4.0 apply vprommid on dedupe [`#368`](https://github.com/orma/openroads-vn-analytics/pull/368)
- v0.3.0 Search in the editor selects the feature for editing [`#363`](https://github.com/orma/openroads-vn-analytics/pull/363)
- v0.2.0 [ready] Feature/tasks filter [`#361`](https://github.com/orma/openroads-vn-analytics/pull/361)
- Feature/road count [`#346`](https://github.com/orma/openroads-vn-analytics/pull/346)
- Feature/active road [`#342`](https://github.com/orma/openroads-vn-analytics/pull/342)
- Deploy updated zoom handling and better road dumps [`#341`](https://github.com/orma/openroads-vn-analytics/pull/341)
- Feature/map position [`#339`](https://github.com/orma/openroads-vn-analytics/pull/339)
- Pre-holiday deploy [`#338`](https://github.com/orma/openroads-vn-analytics/pull/338)
- Feature/edit properties [`#335`](https://github.com/orma/openroads-vn-analytics/pull/335)
- Feature/road view [`#331`](https://github.com/orma/openroads-vn-analytics/pull/331)
- Add chart to compare road lengths, closes #274 [`#334`](https://github.com/orma/openroads-vn-analytics/pull/334)
- Feature/back button [`#330`](https://github.com/orma/openroads-vn-analytics/pull/330)
- Deploy fixed Assets sorting and road state management [`#329`](https://github.com/orma/openroads-vn-analytics/pull/329)
- Feature/road store [`#326`](https://github.com/orma/openroads-vn-analytics/pull/326)
- Deploy improved error messages and default-show no-VPRoMMS roads [`#328`](https://github.com/orma/openroads-vn-analytics/pull/328)
- Feature/error messaging [`#324`](https://github.com/orma/openroads-vn-analytics/pull/324)
- Trim down Transifex build script [`#323`](https://github.com/orma/openroads-vn-analytics/pull/323)
- Deploy road ID CRUD interface [`#322`](https://github.com/orma/openroads-vn-analytics/pull/322)
- Feature/road id crud [`#318`](https://github.com/orma/openroads-vn-analytics/pull/318)
- Deploy translation improvements [`#321`](https://github.com/orma/openroads-vn-analytics/pull/321)
- Feature/redux langauge module [`#304`](https://github.com/orma/openroads-vn-analytics/pull/304)
- Deploy FAQ page [`#302`](https://github.com/orma/openroads-vn-analytics/pull/302)
- Feature/faq [`#301`](https://github.com/orma/openroads-vn-analytics/pull/301)
- Bugfix/refresh task [`#300`](https://github.com/orma/openroads-vn-analytics/pull/300)
- Remove troublesome form-grid Sass, to fix CSS error [`#296`](https://github.com/orma/openroads-vn-analytics/pull/296)
- Fix transifex duplicate-key bug [`#294`](https://github.com/orma/openroads-vn-analytics/pull/294)
- Deploy updated UI and task features/bugfixes [`#292`](https://github.com/orma/openroads-vn-analytics/pull/292)
- Feature/tasks count [`#287`](https://github.com/orma/openroads-vn-analytics/pull/287)
- Feature/translations [`#286`](https://github.com/orma/openroads-vn-analytics/pull/286)
- Tasks/delete nodes [`#217`](https://github.com/orma/openroads-vn-analytics/pull/217)
- New search and more [`#275`](https://github.com/orma/openroads-vn-analytics/pull/275)
- Deploy some interface fixes [`#266`](https://github.com/orma/openroads-vn-analytics/pull/266)
- update readme with transifex info [`#264`](https://github.com/orma/openroads-vn-analytics/pull/264)
- Hotfix/no bbox [`#258`](https://github.com/orma/openroads-vn-analytics/pull/258)
- Bug/capital vpromm [`#259`](https://github.com/orma/openroads-vn-analytics/pull/259)
- Hotfix/search vietnamese [`#257`](https://github.com/orma/openroads-vn-analytics/pull/257)
- sort ascending to show field data first [`#256`](https://github.com/orma/openroads-vn-analytics/pull/256)
- Switch all references from Analytics to Assets [`#255`](https://github.com/orma/openroads-vn-analytics/pull/255)
- Update road dump links [`#241`](https://github.com/orma/openroads-vn-analytics/pull/241)
- Hotfix to RLP upload issue, by including a name to the multipart upload file [`#237`](https://github.com/orma/openroads-vn-analytics/pull/237)
- Add unstyled upload for RLP geometries and properties [`#230`](https://github.com/orma/openroads-vn-analytics/pull/230)
- Deploy Analytics fixes [`#218`](https://github.com/orma/openroads-vn-analytics/pull/218)
- Enhancement/render refactor [`#197`](https://github.com/orma/openroads-vn-analytics/pull/197)
- Deploy latest version [`#198`](https://github.com/orma/openroads-vn-analytics/pull/198)
- Feature/pagination [`#189`](https://github.com/orma/openroads-vn-analytics/pull/189)
- Design Tweaks [`#190`](https://github.com/orma/openroads-vn-analytics/pull/190)
- Bug/nested component lang [`#180`](https://github.com/orma/openroads-vn-analytics/pull/180)
- Update prod URLs [`#196`](https://github.com/orma/openroads-vn-analytics/pull/196)
- Use correct user to deploy [`#195`](https://github.com/orma/openroads-vn-analytics/pull/195)
- Hotfix ssh issues [`#194`](https://github.com/orma/openroads-vn-analytics/pull/194)
- Deploy new version [`#193`](https://github.com/orma/openroads-vn-analytics/pull/193)
- Fix/deploy to singapore [`#192`](https://github.com/orma/openroads-vn-analytics/pull/192)
- Enhancement/vpromms filter route [`#175`](https://github.com/orma/openroads-vn-analytics/pull/175)
- Add id on vpromm list [`#169`](https://github.com/orma/openroads-vn-analytics/pull/169)
- Deploy latest version [`#167`](https://github.com/orma/openroads-vn-analytics/pull/167)
- fix data loading issue [`#163`](https://github.com/orma/openroads-vn-analytics/pull/163)
- Remove useless files and dependencies [`#165`](https://github.com/orma/openroads-vn-analytics/pull/165)
- Point everything to correct server [`#157`](https://github.com/orma/openroads-vn-analytics/pull/157)
- Deploy for Phase 1 delivery note [`#156`](https://github.com/orma/openroads-vn-analytics/pull/156)
- Feature/78 subprovince analytics [`#155`](https://github.com/orma/openroads-vn-analytics/pull/155)
- Road tasks [`#117`](https://github.com/orma/openroads-vn-analytics/pull/117)
- Deploy iD link update [`#154`](https://github.com/orma/openroads-vn-analytics/pull/154)
- Update iD link to one hosted on S3 [`#153`](https://github.com/orma/openroads-vn-analytics/pull/153)
- Deploy site to AWS [`#151`](https://github.com/orma/openroads-vn-analytics/pull/151)
- Hello Circle CI [`#150`](https://github.com/orma/openroads-vn-analytics/pull/150)
- Feature/field data map [`#99`](https://github.com/orma/openroads-vn-analytics/pull/99)
- Feature/vpromms zoom [`#142`](https://github.com/orma/openroads-vn-analytics/pull/142)
- Fix deploy error on master [`#147`](https://github.com/orma/openroads-vn-analytics/pull/147)
- Deploy latest version [`#146`](https://github.com/orma/openroads-vn-analytics/pull/146)
- Update prod to point to new API. Fix #95 [`#145`](https://github.com/orma/openroads-vn-analytics/pull/145)
- Switch IRI gradient to green-red. Fix #106 [`#139`](https://github.com/orma/openroads-vn-analytics/pull/139)
- [WIP] Table properties design [`#134`](https://github.com/orma/openroads-vn-analytics/pull/134)
- Fixes [`#123`](https://github.com/orma/openroads-vn-analytics/pull/123)
- Fix lost code commit [`#130`](https://github.com/orma/openroads-vn-analytics/pull/130)
- Feature/csv link [`#118`](https://github.com/orma/openroads-vn-analytics/pull/118)
- Feature/search [`#97`](https://github.com/orma/openroads-vn-analytics/pull/97)
- Feature/mulitlingual [`#100`](https://github.com/orma/openroads-vn-analytics/pull/100)
- Feature/mulitlingual [`#65`](https://github.com/orma/openroads-vn-analytics/pull/65)
- Per Sarah's request, switch all Lao Cai VPRoMMS road IDs to start with 024 [`#64`](https://github.com/orma/openroads-vn-analytics/pull/64)
- Fix admin area dumps [`#63`](https://github.com/orma/openroads-vn-analytics/pull/63)
- Fix province dump URLs [`#62`](https://github.com/orma/openroads-vn-analytics/pull/62)
- Fix UI reversion [`#61`](https://github.com/orma/openroads-vn-analytics/pull/61)
- This reverts commit 2d82fb14446f1de0dadf2c317a86c09d51535284, reversing [`#56`](https://github.com/orma/openroads-vn-analytics/pull/56)
- merge bug fixes and style changes [`#59`](https://github.com/orma/openroads-vn-analytics/pull/59)
- implement globZoom [`#56`](https://github.com/orma/openroads-vn-analytics/pull/56)
- Feature/design tweaks [`#58`](https://github.com/orma/openroads-vn-analytics/pull/58)
- Bug/subpage highlight [`#55`](https://github.com/orma/openroads-vn-analytics/pull/55)
- Deploy fixed province dumps [`#54`](https://github.com/orma/openroads-vn-analytics/pull/54)
- Fix mixed-security error [`#49`](https://github.com/orma/openroads-vn-analytics/pull/49)
- Remove minification, until we can figure out the bug [`#48`](https://github.com/orma/openroads-vn-analytics/pull/48)
- Deploy [`#45`](https://github.com/orma/openroads-vn-analytics/pull/45)
- Feature/tables [`#44`](https://github.com/orma/openroads-vn-analytics/pull/44)
- fix title bug [`#32`](https://github.com/orma/openroads-vn-analytics/pull/32)
- [WIP] Redesign for VN [`#29`](https://github.com/orma/openroads-vn-analytics/pull/29)
- Feature/download btn [`#27`](https://github.com/orma/openroads-vn-analytics/pull/27)
- Deploy latest [`#8`](https://github.com/orma/openroads-vn-analytics/pull/8)
- Add individual progress [`#7`](https://github.com/orma/openroads-vn-analytics/pull/7)
- Feature/partition by province [`#4`](https://github.com/orma/openroads-vn-analytics/pull/4)
- Update README.md [`#3`](https://github.com/orma/openroads-vn-analytics/pull/3)
- Vietnam [`#2`](https://github.com/orma/openroads-vn-analytics/pull/2)
- Feature/fix build [`#1`](https://github.com/orma/openroads-vn-analytics/pull/1)
- Add button to download road network [`#145`](https://github.com/orma/openroads-vn-analytics/pull/145)
- Enable project layer when linking frmo projects [`#143`](https://github.com/orma/openroads-vn-analytics/pull/143)
- Always set national extent to 100% [`#141`](https://github.com/orma/openroads-vn-analytics/pull/141)
- Feature/filter projects [`#139`](https://github.com/orma/openroads-vn-analytics/pull/139)
- Feature/filter projects [`#137`](https://github.com/orma/openroads-vn-analytics/pull/137)
- Updates the MB sources [`#136`](https://github.com/orma/openroads-vn-analytics/pull/136)
- Add page for project tasks [`#134`](https://github.com/orma/openroads-vn-analytics/pull/134)
- Link project to bbox and iD when available [`#131`](https://github.com/orma/openroads-vn-analytics/pull/131)
- Tweak pagination styling to avoid React error [`#129`](https://github.com/orma/openroads-vn-analytics/pull/129)
- Add more project types, and tweak columns in that view [`#126`](https://github.com/orma/openroads-vn-analytics/pull/126)
- Hook projects to the api [`#125`](https://github.com/orma/openroads-vn-analytics/pull/125)
- Refactor dashboard national pages. Fix developmentseed/openroads#351 [`#124`](https://github.com/orma/openroads-vn-analytics/pull/124)
- Fix broken pages [`#123`](https://github.com/orma/openroads-vn-analytics/pull/123)
- Implement new map completeness viz. [`#121`](https://github.com/orma/openroads-vn-analytics/pull/121)
- Include actual km length in extent [`#119`](https://github.com/orma/openroads-vn-analytics/pull/119)
- Show waytask state on list [`#118`](https://github.com/orma/openroads-vn-analytics/pull/118)
- Replace Lorem Ipsum with intro text [`#116`](https://github.com/orma/openroads-vn-analytics/pull/116)
- Extent & Completion in dashboard [`#113`](https://github.com/orma/openroads-vn-analytics/pull/113)
- Add legend to chart [`#112`](https://github.com/orma/openroads-vn-analytics/pull/112)
- Search for editor [`#111`](https://github.com/orma/openroads-vn-analytics/pull/111)
- Point production to right db [`#110`](https://github.com/orma/openroads-vn-analytics/pull/110)
- Fix/build cname [`#108`](https://github.com/orma/openroads-vn-analytics/pull/108)
- Add the CNAME. Fix #305 [`#106`](https://github.com/orma/openroads-vn-analytics/pull/106)
- Add the CNAME. Fix #305 [`#105`](https://github.com/orma/openroads-vn-analytics/pull/105)
- Set Heroku API as production [`#103`](https://github.com/orma/openroads-vn-analytics/pull/103)
- Add the road network layer. Fix developmentseed/openroads#288 [`#101`](https://github.com/orma/openroads-vn-analytics/pull/101)
- Feature/issues160405 [`#102`](https://github.com/orma/openroads-vn-analytics/pull/102)
- Enable browser back option for editor [`#100`](https://github.com/orma/openroads-vn-analytics/pull/100)
- Listen for navigate events from iframe [`#99`](https://github.com/orma/openroads-vn-analytics/pull/99)
- Feature/issues misc [`#98`](https://github.com/orma/openroads-vn-analytics/pull/98)
- bug terminator [`#97`](https://github.com/orma/openroads-vn-analytics/pull/97)
- Start the map centered on the ph [`#96`](https://github.com/orma/openroads-vn-analytics/pull/96)
- Feature/waytasks [`#95`](https://github.com/orma/openroads-vn-analytics/pull/95)
- Update map id. Contribute to #developmentseed/openroads#285 [`#94`](https://github.com/orma/openroads-vn-analytics/pull/94)
- Initial implementation of tofix tasks [`#92`](https://github.com/orma/openroads-vn-analytics/pull/92)
- Landing page [`#93`](https://github.com/orma/openroads-vn-analytics/pull/93)
- Tie subregion stats to data [`#91`](https://github.com/orma/openroads-vn-analytics/pull/91)
- Fix/css [`#90`](https://github.com/orma/openroads-vn-analytics/pull/90)
- Remove relics from the past [`#89`](https://github.com/orma/openroads-vn-analytics/pull/89)
- Add bounds to iD link [`#87`](https://github.com/orma/openroads-vn-analytics/pull/87)
- Make sure that the MB css loads [`#88`](https://github.com/orma/openroads-vn-analytics/pull/88)
- Set the correct staging api [`#86`](https://github.com/orma/openroads-vn-analytics/pull/86)
- Dashboards v2 [`#85`](https://github.com/orma/openroads-vn-analytics/pull/85)
- Set up staging deploy to AWS [`#84`](https://github.com/orma/openroads-vn-analytics/pull/84)
- Feature/api data [`#83`](https://github.com/orma/openroads-vn-analytics/pull/83)
- Feature/polish redesign [`#82`](https://github.com/orma/openroads-vn-analytics/pull/82)
- Initial implementation of new redesign. [`#81`](https://github.com/orma/openroads-vn-analytics/pull/81)
- Feature/pie chart [`#80`](https://github.com/orma/openroads-vn-analytics/pull/80)
- Minor fixes [`#79`](https://github.com/orma/openroads-vn-analytics/pull/79)
- Push changes to production [`#76`](https://github.com/orma/openroads-vn-analytics/pull/76)
- Consistent dashboard [`#75`](https://github.com/orma/openroads-vn-analytics/pull/75)
- Deploying null display [`#74`](https://github.com/orma/openroads-vn-analytics/pull/74)
- Displays null/0 as - [`#73`](https://github.com/orma/openroads-vn-analytics/pull/73)
- Deploy roads by responsibility [`#72`](https://github.com/orma/openroads-vn-analytics/pull/72)
- Adds administrative responsibility endpoint [`#71`](https://github.com/orma/openroads-vn-analytics/pull/71)
- Point analytics to new API [`#70`](https://github.com/orma/openroads-vn-analytics/pull/70)
- Point analytics to main API [`#69`](https://github.com/orma/openroads-vn-analytics/pull/69)
- Correct links so they don't open in iframe [`#67`](https://github.com/orma/openroads-vn-analytics/pull/67)
- Publish new landing page [`#66`](https://github.com/orma/openroads-vn-analytics/pull/66)
- Add new landing page [`#65`](https://github.com/orma/openroads-vn-analytics/pull/65)
- Publish latest changes [`#64`](https://github.com/orma/openroads-vn-analytics/pull/64)
- Publish latest changes [`#63`](https://github.com/orma/openroads-vn-analytics/pull/63)
- Feature/build assets [`#61`](https://github.com/orma/openroads-vn-analytics/pull/61)
- Move image to source_assets folder [`#62`](https://github.com/orma/openroads-vn-analytics/pull/62)
- Image in sidebar of country [`#59`](https://github.com/orma/openroads-vn-analytics/pull/59)
- Deploy minor changes [`#57`](https://github.com/orma/openroads-vn-analytics/pull/57)
- Minor tweaks to landing page [`#56`](https://github.com/orma/openroads-vn-analytics/pull/56)
- Deploy latest changes [`#54`](https://github.com/orma/openroads-vn-analytics/pull/54)
- Municipality, Barangays link to editor [`#52`](https://github.com/orma/openroads-vn-analytics/pull/52)
- Add map button and reorganize styles [`#53`](https://github.com/orma/openroads-vn-analytics/pull/53)
- Feature/50 national view [`#51`](https://github.com/orma/openroads-vn-analytics/pull/51)
- Deploy refactored dashboards [`#49`](https://github.com/orma/openroads-vn-analytics/pull/49)
- Refactor codebase [`#48`](https://github.com/orma/openroads-vn-analytics/pull/48)
- Generate new secure key [`#45`](https://github.com/orma/openroads-vn-analytics/pull/45)
- Generate new secure key [`#44`](https://github.com/orma/openroads-vn-analytics/pull/44)
- Actually move files to dist [`#43`](https://github.com/orma/openroads-vn-analytics/pull/43)
- Actually move files to dist [`#42`](https://github.com/orma/openroads-vn-analytics/pull/42)
- Don't make Travis serve site locally. Use gulp build [`#41`](https://github.com/orma/openroads-vn-analytics/pull/41)
- Don't make Travis serve site locally. Use gulp build [`#40`](https://github.com/orma/openroads-vn-analytics/pull/40)
- Deploy [`#39`](https://github.com/orma/openroads-vn-analytics/pull/39)
- Have Travis build and deploy site to gh-pages. Fix #30 [`#34`](https://github.com/orma/openroads-vn-analytics/pull/34)
- Multiple issues [`#35`](https://github.com/orma/openroads-vn-analytics/pull/35)
- Change api url back to fast dawn [`#29`](https://github.com/orma/openroads-vn-analytics/pull/29)
- Feature/project pages [`#28`](https://github.com/orma/openroads-vn-analytics/pull/28)
- Add pngs [`#23`](https://github.com/orma/openroads-vn-analytics/pull/23)
- Rounding module [`#27`](https://github.com/orma/openroads-vn-analytics/pull/27)
- fix hint errors [`#26`](https://github.com/orma/openroads-vn-analytics/pull/26)
- fix top-level cached stats display [`#25`](https://github.com/orma/openroads-vn-analytics/pull/25)
- Feature/subregion pages [`#18`](https://github.com/orma/openroads-vn-analytics/pull/18)
- More precalculated stats [`#22`](https://github.com/orma/openroads-vn-analytics/pull/22)
- [wip] precalculate stats [`#20`](https://github.com/orma/openroads-vn-analytics/pull/20)
- Add datatables [`#14`](https://github.com/orma/openroads-vn-analytics/pull/14)
- Changes admin boundary url [`#13`](https://github.com/orma/openroads-vn-analytics/pull/13)
- Feature/more structure [`#10`](https://github.com/orma/openroads-vn-analytics/pull/10)
- build: more resilient error handling [`#11`](https://github.com/orma/openroads-vn-analytics/pull/11)
- Update approach to browserify in gulp. [`#7`](https://github.com/orma/openroads-vn-analytics/pull/7)
- switch to ejs templates [`#6`](https://github.com/orma/openroads-vn-analytics/pull/6)
- Add compass and gulp as a task automator [`#3`](https://github.com/orma/openroads-vn-analytics/pull/3)
- Scaffold backbone app [`#1`](https://github.com/orma/openroads-vn-analytics/pull/1)
- Fix properties show-hide chevron direction, closes #325 [`#325`](https://github.com/orma/openroads-vn-analytics/issues/325)
- Add no-data Explore view legend item, closes #333 [`#333`](https://github.com/orma/openroads-vn-analytics/issues/333)
- Add chart to compare road lengths, closes #274 [`#274`](https://github.com/orma/openroads-vn-analytics/issues/274)
- Add GOST email as FAQ CC, closes #332 [`#332`](https://github.com/orma/openroads-vn-analytics/issues/332)
- debounce SET_GLOBAL_ZOOM on tasks page, closes #281 [`#281`](https://github.com/orma/openroads-vn-analytics/issues/281)
- Remove reference to "map" on homepage, closes #242 [`#242`](https://github.com/orma/openroads-vn-analytics/issues/242)
- Make properties list scrollable, closes #200 [`#200`](https://github.com/orma/openroads-vn-analytics/issues/200)
- Update prod to point to new API. Fix #95 [`#95`](https://github.com/orma/openroads-vn-analytics/issues/95)
- Switch IRI gradient to green-red. Fix #106 [`#106`](https://github.com/orma/openroads-vn-analytics/issues/106)
- Change IRI colors. Fix #41 [`#41`](https://github.com/orma/openroads-vn-analytics/issues/41)
- Restyle layer picker. Fix #42 [`#42`](https://github.com/orma/openroads-vn-analytics/issues/42)
- Add instructions to upload road data and points, closes #18 [`#18`](https://github.com/orma/openroads-vn-analytics/issues/18)
- Make legend and options dynamic, closes #39 [`#39`](https://github.com/orma/openroads-vn-analytics/issues/39)
- Switch province dumps from province name to province ID, closes #46 [`#46`](https://github.com/orma/openroads-vn-analytics/issues/46)
- Add legend title, closes #51 [`#51`](https://github.com/orma/openroads-vn-analytics/issues/51)
- Update header items, closes #26 [`#26`](https://github.com/orma/openroads-vn-analytics/issues/26)
- Add the CNAME. Fix #305 [`#305`](https://github.com/orma/openroads-vn-analytics/issues/305)
- Use last subregion instead of first to determine child ID. [`#298`](https://github.com/developmentseed/openroads/issues/298)
- Move image below the nav. Fix #58 [`#58`](https://github.com/orma/openroads-vn-analytics/issues/58)
- Fix #19. Add search for admin areas [`#19`](https://github.com/orma/openroads-vn-analytics/issues/19)
- Have Travis build and deploy site to gh-pages. Fix #30 [`#30`](https://github.com/orma/openroads-vn-analytics/issues/30)
- Fix #15. Add spinner [`#15`](https://github.com/orma/openroads-vn-analytics/issues/15)
- Fix #32. Correct jshint errors [`#32`](https://github.com/orma/openroads-vn-analytics/issues/32)
- Fix #31. Remove analytics from url. [`#31`](https://github.com/orma/openroads-vn-analytics/issues/31)
- Use /subregion endpoint to create list pages. [`#12`](https://github.com/orma/openroads-vn-analytics/issues/12)
- Lint [`cd0edb6`](https://github.com/orma/openroads-vn-analytics/commit/cd0edb68f444b3dca66abbc4afea1528f38ec753)
- Style step2 selection on tasks [`8d916aa`](https://github.com/orma/openroads-vn-analytics/commit/8d916aaddba195805fbfe472f708d8a5b339067a)
- Fix error when trying to render province [`ef8c85f`](https://github.com/orma/openroads-vn-analytics/commit/ef8c85fda12c7d95833886f72f6be8827549b5db)
