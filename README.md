# redirandom: Redirect to random URLs

Got a web site and want to use it to encourage people to visit your friends'
web sites too? There are many ways to do that, including webrings, blogrolls,
or just putting links wherever they make sense.

This project provides one more option, offering personal-scale "ads" that are
independent of the ad-tech industry. I have a little [demo][] which shows ads
from several webcomics whose authors supported another of my projects, [Comic
Rocket][].

Although I'm using the word "ad", there doesn't have to be any money changing
hands, and in fact this tool does not provide any help if you want to get paid
for displaying ads. You could make arrangements by other means to get paid if
you want to, and then use this tool just for making the ads show up, but that's
none of my business and is between you and your advertisers.

[demo]: https://jameysharp.github.io/redirandom/image-sample.html
[Comic Rocket]: https://www.comic-rocket.com/

## For "advertisers"

If you'd appreciate friendly people voluntarily showing ads on their web sites
for whatever you're working on, you should make it easy for them to do that.

First, design one or more ad images you'd like people to use, and store them
somewhere on your web site. (If graphic design is not your favorite thing,
there are many artists out there who would be delighted if you would commission
some nice images from them.)

Second, make a plain text file where each line describes one of the ads you
made. You need to provide three pieces of information:

- What web page do you want to send someone to if they click on this ad?
- What image do you want to display for this ad, and what URL is it at?
- What text do you want to present as an alternative for people who can't see
  the image?

(*TODO: Image dimensions probably should go here too.*)

These three parts should be separated by spaces or tabs. So it looks like:

```
https://link.example/kitties https://image.example/kitties.webp Look, kitties!
https://link.example/puppies https://image.example/puppies.jpg Oh it's puppies!
```

Put this file on your web site somewhere too. Finally, you can tell people the
URL of this text file. That's all they need from you to start showing your ads
on their site.

## For "publishers"

If you've gotten some of the above URLs from people you want to support, put
them in a plain text file, one per line:

```
https://alice.example/my-ads
https://bob.example/support-me
```

If you have some ads of your own that you also want to display sometimes, you
can add them to this file too, in the same format as described above for
advertisers.

Once you store this file somewhere on your web site, you need a little bit of
HTML placed in the spot where you want the ads to appear on your web pages. You
need three pieces of information to do this:

- The URL of an instance of this project.
- The dimensions (width and height) of the space you've reserved for this ad.
- The URL where your text file is stored.

If we call those `{i}`, `{w}`/`{h}`, and `{f}` respectively, you can fill those
in to this template to embed a random choice from your selected ads:

```
<iframe style="border: 0" width={w} height={h} src="{i}{w}/{h}/{f}"></iframe>
```

There's currently a demo instance at <https://redirandom.netlify.app/image/>
but I may change that at any time. (You can run your own instance if that's
something you're into.)

If you want to use the demo instance, and your space is 720 pixels wide and 90
pixels tall, and you placed your text file at `https://example.com/my-friends`,
then you'd add this HTML to your site:

```
<iframe style="border: 0" width=720 height=90
  src="https://redirandom.netlify.app/image/720/90/https://example.com/my-friends">
</iframe>
```

You can see this in action on the [demo][].

Many content management systems and static site generators will allow you to
add arbitrary HTML to your pages like this, but you may need to dig into their
documentation to figure out how.

## Tips and variations

### Image size conventions

It's helpful to use [common banner ad sizes][ad-formats] such as 728x90 for
wide "leaderboard" ads, 160x600 for tall "skyscraper" ads, or 88x31 for small
buttons. If the advertiser doesn't have any images of the size that the
publisher is expecting then things won't go well, so it helps if everybody
agrees on a few common sizes. But you certainly can offer other sizes if you
want, and see if anybody else wants to support them.

[ad-formats]: https://en.wikipedia.org/wiki/Digital_display_advertising#Importance_of_formats_of_display_ads

### Relative URLs

If any URL is not absolute, it will be interpreted relative to the URL of the
text file it came from. For example, if you store the following at
`https://example.org/public/banners`:

```
/cool-zone ad1312.jpg The "cool zone"
```

Then that's equivalent to this longer definition:

```
https://example.org/cool-zone https://example.org/public/ad1312.jpg The "cool zone"
```

### Comments

You can leave notes for yourself or others in the text files that you create
for this tool. For example, you might want to note when you created a
particular ad, or who you commissioned the image from.

Any line which begins with `#`, as well as any blank line, will be ignored by
this service:

```
# I made this image using krita.org on 2025-08-12:
/ krita-ad.jpg 

# My buddy Lem made this for me:
/ lem-on-ad.png
```

### Nested lists

In the guide above I mentioned that a site hosting ads can put together a list
of URLs referring to other lists hosted elsewhere. It's not limited to two layers
of nesting, though.

For example, a webring, cooperative, or other community might publish a list of
all the participating web sites. Each site has their own list with one or
several ad campaigns in it. Then somebody displaying ads on their site might
make a list that includes the community list along with other sites they want
to support.

The current implementation gives up if it gets past ten layers of nesting. Even
that might be too many, I'm not sure yet. But I think at least three or four
layers are useful sometimes.

To avoid certain kinds of accidents, if a list includes by reference another
list, but the other list is one we've already looked at, then that list is
removed from consideration.

### Bandwidth and speed considerations

I've designed this approach to share the cost of the advertising service fairly
between the participants. In most ad networks, an ad-tech provider (such as
Google) hosts your ad images for you. The bandwidth costs of serving all those
ads makes this expensive for the middleman, but they take a big enough cut of
the ad payments that they make a tidy profit anyway.

Instead, I'm hoping to be able to offer this service for free, but you have to
host your own ad images. This means that if some big site starts promoting your
little web site, your bandwidth costs might increase. But hopefully you're
happy about that because you're getting more visitors.

Besides, then you have control over how your ads are served, and you can
optimize them to reduce file sizes and increase cacheability, or start using a
CDN, or do any number of other things to keep your costs manageable.

I do recommend configuring your web server to serve both images and text files
with:

- an `etag` header so the contents don't need to be served again to the same
  client if they haven't changed
- a header like `cache-control: max-age=600` (600 seconds is 10 minutes but you
  may want longer) to allow clients to not even check for changes very often

There are many guides out there for optimizing cacheability, images, and page
speed; this is not the place for another. If you can find a friendly nerd who
would enjoy info-dumping about HTTP semantics, they may also be able to help.

### Privacy and security considerations

This tool does not send any JavaScript to visitors' web browsers, so these ads
can't hide cryptocurrency miners or other malware. And I don't track anything
about your web site visitors.

But you don't entirely have to take my word for it. The sample HTML for
publishers above is the simplest form that works, but you can safely add more
settings to restrict these ads in a variety of ways.

To enforce that ads can't use JavaScript, you can add this attribute to the
`iframe` tag:

```
sandbox="allow-popups allow-popups-to-escape-sandbox"
```

The `allow-popups` flag is necessary so that if the visitor clicks the ad, the
target page can open in a new tab or window. As long as you don't also specify
`allow-script`, no other kinds of pop-ups are possible. And you need
`allow-popups-to-escape-sandbox` so that the target page, in its new tab, can
be allowed to use JavaScript or anything else.

To help limit what information the service can collect about visitors, you can
add these attributes to the `iframe` tag:

```
referrerpolicy="no-referrer" credentialless
```

Other information about visitors is available to the service and I'm not aware
of anything that you as a web developer can do to limit it. For example,

- visitor IP address (and by extension their approximate location)
- fingerprintable browser behavior, including the `user-agent` request header
  and TLS fingerprinting methods such as JA3

For these cases, you may need to trust that the service is not using these
methods to track individual visitors. You do always have the option of running
your own instance if this is a concern for you.

## Future work

I want to allow people to adjust the relative likelihood that different ads
will be selected, in case you want to show some people's ads often and just
sprinkle other people's ads in occasionally. But notably that does not involve
any tracking: no tracking of visitors, and no tracking of ad views. This both
makes ad serving dramatically cheaper to do, and helps preserve your visitors'
privacy to some extent.

Additional tools are needed for validating and previewing files in the text
format defined by this project.

## Non-goals

There are many features in real "ad servers" that this approach does not
support and that I have no intention of adding. For example, this doesn't
provide any analytics for tracking impressions, clicks, or conversions. There's
no auction, programmatic bidding, or retargeting. I might add geo-targeting but
that's about as far as this project can or will go.
