/** @jsx h */
import {
  h,
  Fragment
} from "preact";
import {
  PageProps,
  Handlers
} from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";

import { marked } from "marked";
import sanitize   from "sanitize-html";

import { findOne }        from "../../../utils/articles/helper.ts";
import { ArticleSchema }  from "../../../utils/db/articles.ts";
import { unixtimeToJST }  from "../../../utils/funcs/time.ts";

import BasicHead    from "../../../islands/BasicHead.tsx";
import BasicFooter  from "../../../islands/BasicFooter.tsx";


export const handler: Handlers<ArticleSchema> = {
  async GET(_, ctx) {
    const id = ctx.params.id;
    let data;
    try {
      data = await findOne(parseInt(id.toString()));
    } catch (error) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/blogs/",
        },
      });
    }

    if (!data) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/blogs/",
        },
      });
    }
    
    return ctx.render(data);
  },
};


export default function Neko({data}: PageProps<ArticleSchema>) {
  const parsed = marked(data.content);
  const content = sanitize(parsed);
  const imageUrl = data.imageUrl? data.imageUrl : "/images/about.png";

  return (
    <Fragment>
      <Head>
        <BasicHead/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/github-dark-dimmed.min.css" />
        <link rel="stylesheet" href="/styles/basic.css" />
        <link rel="stylesheet" href="/styles/articles/status.css" />
        <title>{data.name} - Daruo</title>
      </Head>

      <header>
        <nav id="header" class="navbar navbar-expand-lg navbar-light bg-transparent">
          <a id="logoLink" class="navbar-brand" href="/">
            Daruo
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarDark"
            aria-controls="navbarDark" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarDark">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <a class="nav-link" href="/">Portfolio</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/blogs/">Index</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        <div class="status container py-5">
          <h2 class="name">{data.name}</h2>
          <div class="createdAt">{unixtimeToJST(data.createdAt)}</div>
          <div class="updatedAt">{unixtimeToJST(data.updatedAt)}</div>

          <hr/>
  
  
          <div class="himg">
              <img src={`${imageUrl}`} />
          </div>
  
          <div id="content" class="content container" dangerouslySetInnerHTML={{__html: content}}></div>
        </div>
      </main>
      <div class="divider divider-dashed"></div>

      <footer>
        <BasicFooter/>
      </footer>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
      <script>
        hljs.initHighlightingOnLoad();
      </script>
      <script src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js" crossorigin="anonymous"></script>
      <script>
          twemoji.parse(document.body);
      </script>
    </Fragment>
  );
}