---
title: 'Categories'
date: 2022-01-20T17:01:34+07:00
layout: default
banner_image: "../assets/images/banner-shape.png"
bodyClass: page-contact
---
<section class="breadcrumb_section">
  <div class="container">
     <h1 class="page_title">
        <span class="d-block">{{ page.title }} </span>
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
               {% for category in site.categories %}
                  {% capture category_name %}{{ category | first }}{% endcapture %}
                  <h3 class="category-head">{{ category_name }}</h3>
                  {% for post in site.categories[category_name] %}                
                  <div class="blog_standard_layout">
                        <a class="item_image" href="{{ post.url }}">
                            <img src="{{ post.thumbnail }}" alt="image_not_found">
                        </a>
                        <div class="item_content">
                            <ul class="post_meta ul_li text-uppercase">
                                <li>By - <a href="#!">{{ post.author }}</a></li>
                                <li><a href="#!">{{ post.cat }}</a></li>
                            </ul>
                            <h3 class="item_title text_effect_wrap">
                                <a href="{{ post.url }}">
                                    <span class="text_effect_wrap1">
                                        <span class="text_effect_wrap2">
                                            <span class="text_effect_wrap3">{{ post.title }}</span>
                                        </span>
                                    </span>
                                </a>
                            </h3>
                            <p>
                                {{ post.description }}
                            </p>
                            <a class="btn_text text-uppercase" href="{{ post.url }}"><span>Read More</span> <i class="fal fa-long-arrow-right"></i></a>
                        </div>
                    </div>                  
                  {% endfor %}
               {% endfor %}
          </div>
          <div class="col-lg-4 col-md-8 col-sm-10">
              <aside class="sidebar_section">
                  {% include blog/sidebar.html %}
              </aside>
          </div>
      </div>
  </div>
</section>