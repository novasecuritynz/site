---
date: 2024-01-01T00:00:00+00:00
layout: default
banner_image: "../assets/images/banner-shape.png"
bodyClass: page-blogs
---
{% include banner.html %}
<!-- Blog Section - Start
   ================================================== -->
<section class="blog_section section_space pt-5">
   <div class="container">
      <div class="heading_block mb-0">
         <mark class="heading_focus_title">Latest Insights</mark>
      </div>
      <div class="row">
         <div class="col-12">
            <div class="row">
               {% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
               {% for year_group in posts_by_year %}
               <!-- Year Header -->
               <div class="col-12">
                  <h2 class="year-header text-white border-bottom border-light pb-2 mb-4">
                     {{ year_group.name }}
                  </h2>
               </div>
               {% for post in year_group.items %}
               <div class="col-12 mb-4">
                  <div class="review_block">
                     <div class="row align-items-start">
                        <!-- {% if post.thumbnail %}
                           <div class="col-2">
                             <div class="blog_image">
                               <a href="{{ post.url | relative_url }}">
                                 <img src="{{ post.thumbnail | relative_url }}" alt="{{ post.title }}" class="img-fluid rounded">
                               </a>
                             </div>
                           </div>
                           <div class="col-10">
                           {% else %} -->
                        <div class="col-12">
                           <!-- {% endif %} -->
                           <div class="blog_content text-left">
                              <h3 class="blog_title mb-3">
                                 <a href="{{ post.url | relative_url }}" class="text-decoration-none font-weight-bold">
                                 <strong>{{ post.title }}</strong>
                                 </a>
                              </h3>
                              <div class="blog_meta mb-3">
                                 <small class="date text-white">
                                 <i>
                                  {{ post.date | date: "%B %d, %Y" }}
                                 </i>
                                 </small>
                              </div>
                              <small class="mb-3">
                              {% if post.description %}
                              {{ post.description }}
                              {% else %}
                              {{ post.content | strip_html | truncatewords: 30 }}
                              {% endif %}
                              <br>
                              </small>
                              <a href="{{ post.url | relative_url }}" class="btn btn-outline-primary btn-sm mt-3">
                              Read More <i class="fas fa-arrow-right ml-1"></i>
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               {% endfor %}
               {% endfor %}
               {% if site.posts.size == 0 %}
               <div class="col-12">
                  <div class="review_block text-center">
                     <h4>No blog posts found</h4>
                     <p class="text-muted">Check back later for our latest security insights and case studies.</p>
                  </div>
               </div>
               {% endif %}
            </div>
         </div>
      </div>
   </div>
</section>
<!-- Blog Section - End
   ================================================== -->