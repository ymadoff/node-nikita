# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig =

  # Template Data
  # =============
  # These are variables that will be accessible via our templates
  # To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

  templateData:

    # Specify some site properties
    site:
      # The production url of our website
      url: "http://mecano.adaltas.com"

      # Here are some old site urls that you would like to redirect from
      oldUrls: [
      ]

      # The default title of our website
      title: "Mecano"

      # The website description (for SEO)
      description: """
        Common functions for system deployment.
        """

      # The website keywords (for SEO) separated by commas
      keywords: """
        deploy, masson, build, ssh, system, install, fs, task, cli
        """

      # The website author's name
      author: "David Worms"

      # The website author's email
      email: "david@adaltas.com"

      # Your company's name
      copyright: "© Adaltas 2014"
      
      sitemap:
        '/docs':
          label: 'Documentation'
          children:
            '/docs/usage': label: 'Common usage'
            '/docs/conditions': label: 'Conditions'
            '/docs/ssh': label: 'SSH'
            '/docs/reporting': label: 'Reporting'
        '/core':
          label: 'Core'
          children: []
        '/extra':
          label: 'Extra'
          children: []
        '/community':
          label: 'Community'
          children:
            '/community/license':
              label: 'License'
            'https://github.com/wdavidw/node-mecano':
              label: 'GitHub'
            'https://www.npmjs.org/package/csv':
              label: 'NPM'

    # plugins:
    #   stylus:
    #     useNib: true

    # Helper Functions
    # ----------------

    # Get the prepared site/document title
    # Often we would like to specify particular formatting to our page's title
    # we can apply that formatting here
    getPreparedTitle: ->
      # if we have a document title, then we should use that and suffix the site's title onto it
      if @document.title
        "#{@document.title} | #{@site.title}"
      # if our document does not have it's own title, then we should just use the site's title
      else
        @site.title

    # Get the prepared site/document description
    getPreparedDescription: ->
      # if we have a document description, then we should use that, otherwise use the site's description
      @document.description or @site.description

    # Get the prepared site/document keywords
    getPreparedKeywords: ->
      # Merge the document keywords with the site keywords
      @site.keywords.concat(@document.keywords or []).join(', ')


  # Collections
  # ===========
  # These are special collections that our website makes available to us

  collections:
    # For instance, this one will fetch in all documents that have pageOrder set within their meta data
    pages: (database) ->
      database.findAllLive({filename: $endsWith: 'html.md'}, [pageOrder:1])
    core: (database) ->
      database.findAllLive({relativeOutDirPath:'core', filename: $endsWith: 'coffee.md'}, [pageOrder:1])
    extra: (database) ->
      database.findAllLive({relativeOutDirPath:'extra', filename: $endsWith: 'coffee.md'}, [pageOrder:1])
    # This one, will fetch in all documents that will be outputted to the posts directory
    posts: (database) ->
      database.findAllLive({relativeOutDirPath:'posts'},[date:-1])


  # DocPad Events
  # =============

  # Here we can define handlers for events that DocPad fires
  # You can find a full listing of events on the DocPad Wiki
  events:

    # Server Extend
    # Used to add our own custom routes to the server before the docpad routes are added
    serverExtend: (opts) ->
      # Extract the server from the options
      {server} = opts
      docpad = @docpad

      # As we are now running in an event,
      # ensure we are using the latest copy of the docpad configuration
      # and fetch our urls from it
      latestConfig = docpad.getConfig()
      oldUrls = latestConfig.templateData.site.oldUrls or []
      newUrl = latestConfig.templateData.site.url

      # Redirect any requests accessing one of our sites oldUrls to the new site url
      server.use (req,res,next) ->
        if req.headers.host in oldUrls
          res.redirect 301, newUrl+req.url
        else
          next()
    extendCollections: (opts, next) ->
      @docpad.getCollection('pages').on 'add', (document) ->
        document.setMeta
          layout: 'default'
      @docpad.getCollection('core').on 'add', (document) ->
        document.setMeta
          title: document.attributes.basename
          layout: 'default'
          extensions: [ 'html', 'md' ]
      @docpad.getCollection('extra').on 'add', (document) ->
        document.setMeta
          title: document.attributes.basename
          layout: 'default'
          extensions: [ 'html', 'md' ]
      next()


# Export our DocPad Configuration
module.exports = docpadConfig


