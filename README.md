# redirandom: Redirect to random URLs

Given a simple text file somewhere on the web containing a list of URLs, this
web app will pick one of those URLs at random and generate a temporary redirect
(HTTP status 302) to it.

For example, given the URLs in <https://redirandom.netlify.app/sample2>,
clicking this link will redirect you to one of them, chosen randomly:
<https://redirandom.netlify.app/go/https://redirandom.netlify.app/sample2>

My goal is to build the simplest possible "ad server" for use by web site
owners who want to help out other web site owners by showing banner ads for
them. The best way I've found for encouraging your visitors to also support
your friends is to just offer them links to your friends' web sites.

Although I'm using the word "ad", there doesn't have to be any money changing
hands, and in fact this tool does not provide any help if you want to get paid
for displaying ads. You could make arrangements by other means to get paid if
you want to, and then use this tool just for making the ads show up, but that's
none of my business and is between you and your advertisers.

Instead, this tool is focused on making it easy to choose whose ads you want to
display, and then using the simplest possible way to display them. In
particular, you can place an `<iframe>` tag wherever you want it on your web
pages, with the `src` attribute pointing to this app, and pass it the location
of a text file somewhere on your web site that lists the ads you want to rotate
through. This does not require JavaScript or anything on the client side, and
is compatible with static sites as long as there's an instance of this app
running somewhere else that you can use.

The URLs in your list can optionally refer to other URL lists, possibly on
other web sites. This allows your advertisers to publish their own list of ads
which they'd like you to display, for you and anyone else to incorporate by
reference. That allows them to change their ad campaigns without having to
coordinate with anyone. (But if you don't want to let your advertisers change
campaigns without talking with you, then you could copy their URL lists into
your own, instead of incorporating them by reference.)

These nested lists can go multiple layers deep. For example, a web ring or
other community might publish a list of all the participating web sites, where
each site has their own list with one or several ad campaigns in it, and then
you might have a third list of all the communities and individual sites you
want to support.

There are many features in real "ad servers" that this approach does not
support and that I have no intention of adding. For example, this doesn't
provide any analytics for tracking impressions, clicks, or conversions. There's
no auction, programmatic bidding, or retargeting. I might add geo-targeting but
that's about as far as this project can or will go.

I do want to allow you to make some URLs more likely to be selected than
others, which you could use to give proportionally more impressions to some
advertisers than others. But notably that does not involve any tracking: no
tracking of visitors, and no tracking of ad views. This both makes ad serving
dramatically cheaper to do, and helps preserve your visitors' privacy to some
extent.

I've designed this approach to share the cost of the advertising service fairly
between the participants. In most ad networks, an ad-tech provider (such as
Google) hosts your ad images for you. The bandwidth costs of serving all those
ads makes this expensive for the middleman, but they take a big enough cut of
the ad payments that they don't care.

Instead, I'm hoping to be able to offer this service for free, but you have to
host your own ad images. This means that if some big site starts promoting your
little web site, your bandwidth costs might increase. But hopefully you're
happy about that because you're getting more visitors. Besides, then you have
control over how your ads are served, and you can optimize them to reduce file
sizes and increase cacheability, or start using a CDN, or do any number of
other things to keep your costs manageable.
