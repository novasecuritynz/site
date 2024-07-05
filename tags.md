---
layout: default
title: Tags
order: 2
---

<section class="breadcrumb_section">
  <div class="container">
     <h1 class="page_title">
        <span class="d-block">All {{ page.title }} </span>
     </h1>
     <p class="mb-0">
        Guman lay on his armour like back and if he lifted
     </p>
  </div>
</section>


<section class="blog_section section_space pt-0">
  <div class="container">
      <div class="row justify-content-lg-between justify-content-md-center justify-content-sm-center">
          <div class="col-md-8 col-sm-10">
            <ul class="tags_primary ul_li text-uppercase">
             {% for tag in site.tags %}
                {% assign tag_name = tag[0] %}
                <li>
                    <a href="/tags/{{ tag_name | slugify }}/">
                        {{ tag_name | replace: "-", " " }}
                    </a>
                </li>
                {% endfor %}
            </ul>                
          </div>
          <div class="col-lg-4 col-md-8 col-sm-10">
              <aside class="sidebar_section">
                  {% include blog/sidebar.html %}
              </aside>
          </div>
      </div>
  </div>
</section>