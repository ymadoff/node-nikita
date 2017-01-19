---
title: Contribute
layout: Page
sort: 4
community: yes
---

# Documentation

[Nikita website] is written is markdown and use the phenomic engine to convert its content to HTML.

[Nikita website]: https://github.com/adaltas/nikita


 How to contribute at documentation: 

  **Requirement:**

   * Git https://git-scm.com/docs/gittutorial
   * NodeJS
   * text editor (Sublime text)
 

**Install NodeJS on Ubuntu 16 LTS :**

	 sudo apt-get -y install python-software-properties python g++ make &&
	 sudo add-apt-repository -y ppa:chris-lea/node.js &&
	 sudo apt-get -y update &&
	 sudo apt-get -y install nodejs &&

**Node JS on centos 7 :**  

	yum install npm

**Node JS on Arch linux :**

	yaourt -S npm 

**Clone the Git of nikita :**

	git clone	https://github.com/adaltas/node-nikita.git &&
	cd node-nikita

** Modify the branch : **

	git checkout docs

**install the dependance and start the site web : ** 

	npm install 
	npm start 
Open the folder node-nikita with Sublime text.
if there are problem of dependence add this in ./package.json 

**Modify page : **



**Create New page : **

**Send the Modification**

	git add * &&
	git commit -m "message"
	git push origin docs