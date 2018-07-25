function decor1() {
  // 1000, 600
  boundaries.push(new boundary(50, 35, 100, 70, 0));
  boundaries.push(new boundary(width-50, 35, 100, 70, 0));

  boundaries.push(new boundary(width/2, 150, 150, 20, 0));

  boundaries.push(new boundary(190, 180, 280, 20, 0));
  boundaries.push(new boundary(width-190, 180, 280, 20, 0));

  boundaries.push(new boundary(width/2+100, 230, 100, 20, -0.5));

  boundaries.push(new boundary(60, 470, 130, 70, 0));
  boundaries.push(new boundary(width-60, 470, 130, 70, 0));

  boundaries.push(new boundary(width/4, 300, 130, 20, 0));

  boundaries.push(new boundary(60, 320, 150, 20, -PI/4));
  boundaries.push(new boundary(width-60, 320, 150, 20, PI/4));

  boundaries.push(new boundary(width/2, 350, 230, 20, 0));

  boundaries.push(new boundary(width/2, 450, 200, 20, 0));

  boundaries.push(new boundary(260, 530, 50, 10, 0));
  boundaries.push(new boundary(320, 470, 50, 10, 0));
  boundaries.push(new boundary(200, 410, 50, 10, 0));

  boundaries.push(new boundary(width-260, 530, 50, 10, 0));
  boundaries.push(new boundary(width-320, 470, 50, 10, 0));
  boundaries.push(new boundary(width-200, 410, 50, 10, 0));


  boundaries.push(new boundary(0, height-10, 430, 20, 0));
  boundaries.push(new boundary(width, height-10, 430, 20, 0));

  boundaries.push(new boundary(370, height-10, 140, 20, 0));
  boundaries.push(new boundary(width-370, height-10, 140, 20, 0));

}
